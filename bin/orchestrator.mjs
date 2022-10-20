#!node_modules/.bin/zx
import logger from 'debug';
import _ from 'lodash';

const debug = logger('bin:orchestrator');
const moment = require('moment');
const fs = require('fs-extra');

/* the code is actually executed at the end */

async function report(retval, msg) {

  if(retval.status > 300) {
    /* in this case we are in a 4XX 5XX error */
    const errorMessage = await retval.text();
    debug("Error (%d): %s: %s", retval.status, msg, errorMessage);
    return;
  }

  if(JSON.stringify(r).length > 2) {
    debug("(%d) %s: %d bytes (keys: %d)", retval.status, msg,
      JSON.stringify(r).length, _.keys(r).length);
  } else
    debug("Empty answer, HTTP status code: %d", retval.status);
}

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
    console.log(`Submission server error at ${endpoint}: ${error.message}`);
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
        debug("%s %d) %s", twlcc, i, submission.url);
        const schedo = {
          iteration: i,
          testTime: moment().add(timeOffset.amount, timeOffset.unit).toISOString(),
          vantagePoint: twlcc,
          targetURL: submission.url,
          submissionId: submission.id,
          testId: "dah"
        }
        memo.push(schedo);
      })
    });
    return memo;
  }, []);
  debug("Produced %d scheduled activity", scheduled.length);
}

const cacheFile = '.lastSubmission.json';

function updateLocalCache(submissions) {
  let lastSubmissionNewDate = null;
  if(!submissions || !submissions.length) {
    debug("Not updating local cache as no submission have been seen");
  } else {
    const f = _.first(submissions);
    const l = _.last(submissions);
    debug("first %O last %O now %s", f, l, new Date());
    console.log("it should be updateLocalCache");
  }
  return lastSubmissionNewDate;
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
const lastSubmission = await pickLastProcessedSubmission();
debug("Picking submission since %s from %s", lastSubmission, server);
const submissions = await pickRecentSubmission(lastSubmission, server);
const xxx = await updateLocalCache(submissions);
const scheduled = await elaborateSchedule(submissions);
// const results = await sendScheduled(scheduled, adminAuth, server);

console.log(`Schedule completed, sent ${scheduled.length} directives, accepted ${results.inserted}`);
console.log(results);