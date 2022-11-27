#!node_modules/.bin/zx
import { argv, fs, path } from 'zx';
import logger from 'debug';
import _ from 'lodash';

const { report } = require('../utils/cli');
const { computeId } = require('../utils/various');
const debug = logger('bin:orchestrator');
const moment = require('moment');

/* the code is executed at the end,
 * on top there are declarations and functions */

const payload = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: null
};

async function pickRecentSubmission(lastCheckDate, server) {
  // the goal here is to pick the submission more
  // recent of the last time we checked
  const endpoint = server.submission;
  try {
    const isUp = await fetch(`${endpoint}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");

    const param = JSON.stringify({ "after": lastCheckDate });
    debug("Connecting to fetch submission (%s)", param);
    const response = await fetch(`${endpoint}/submission/${param}`);
    const submissionList = await response.json();
    return submissionList;
  } catch(error) {
    console.log(`Server error at ${endpoint}: ${error.message}`);
    process.exit(1);
  }
}

/* one test asap (3 minutes?)
 * one test in 24 hours
 * one test in 7 days */
const scheduleMap = [
  { amount: 3, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' }
];

async function elaborateSchedule(submissions) {
  // return a list of scheduled
  const scheduled = _.reduce(submissions, function(memo, submission) {
    _.each(submission.countryCodes, function(twlcc) {
      _.each(scheduleMap, function(timeOffset, i) {
        const testId = computeId(`${submission.id}_${twlcc}_${i}`);
        debug("%s %d) %s", twlcc, i, submission.url);
        const schedo = {
          iteration: i,
          testTime: moment().add(timeOffset.amount, timeOffset.unit).toISOString(),
          vantagePoint: twlcc,
          targetURL: submission.url,
          submissionId: submission.id,
          testId
        }
        memo.push(schedo);
      })
    });
    return memo;
  }, []);
  debug("Produced %d scheduled activity", scheduled.length);
  return scheduled;
}

const cacheFile = path.join('agents', 'orchestrator_cache.json');

async function updateLocalCache(submissions) {
  if(!submissions || !submissions.length) {
    debug("Not updating local cache as no submission have been seen");
  } else {
    const lastSubmissionNewDate = new Date(_.first(submissions).creationTime);
    const id = _.first(submissions).id;
    await fs.writeJSON(cacheFile, {
      id,
      date: lastSubmissionNewDate.toISOString(),
    })
  }
}

async function pickLastProcessedSubmission() {
  // this function looks into a local database or file
  // when the last submission was fetch, so it can 
  // pick only the most recent submissions.
  // the file is created and overwritten by 
  // updateLocalCache
  try {
    const cache = await fs.readJSON(cacheFile);
    let lastSubmission = new Date(cache.date);
    debug(`read lastSubmission with Id ${cache.id} from ${cache.date}`);
    return lastSubmission;
  } catch(error) {
    debug("%s: %s", cacheFile, error.message);
    debug("Unable to find last Submission, starting from now: %s", new Date());
    return new Date();
  }
}

function fetchAuthenticationMaterial() {
  // at the moment return a static string 
  return "³!A!STRING!³";
}

function loadSettings() {
  return {
    submission: `http://localhost:2002`,
    scheduled: `http://localhost:2003`,
  }
}

// Here is where the execution starts, the functions 
// try to have a self-explainatory name :)
console.log(`This tool pulls from submission and coordinates the scheduled tests`);
const server = loadSettings();
const adminAuth = fetchAuthenticationMaterial();

let lastSubmissionDate = null;
if(argv.date) {
  try {
    lastSubmissionDate = new Date(argv.date);
  } catch(error) {
    console.log(`--date lead to an error: ${error.message}`);
    process.exit(1);
  }
} else {
  lastSubmissionDate = await pickLastProcessedSubmission();
}

async function sendScheduled(objlist, auth, server) {
  const endpoint = server.scheduled;
  try {
    const isUp = await fetch(`${endpoint}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");

    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth, 
        scheduled: objlist
      })
    };
    const response = await fetch(`${endpoint}/scheduled`, payload);
    if(response.status > 300) {
      const t = await response.text();
      console.log(`Error in pushing scheduled: ${response.status}: ${t}`);
      console.log("Quitting");
      process.exit(1);
    }
    const registered = await response.json();
    return registered;
  } catch(error) {
    console.log(`Submission server error at ${endpoint}: ${error.message}`);
    process.exit(1);
  }
}

debug("Picking submission since %s from %s", lastSubmissionDate, server);
const submissions = await pickRecentSubmission(lastSubmissionDate, server);
await updateLocalCache(submissions);
const scheduled = await elaborateSchedule(submissions);
const { results } = await sendScheduled(scheduled, adminAuth, server);

console.log(`Schedule completed, sent ${scheduled.length} directives, accepted ${results.inserted}`);
console.log(results);
