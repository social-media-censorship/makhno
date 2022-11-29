#!node_modules/.bin/zx
import { argv, fs, path, sleep } from 'zx';
import logger from 'debug';
import _ from 'lodash';
import { spawn } from 'child_process';

// review const child_process = require('child_process');
const debug = logger('agent:curl');
const yaml = require('yaml');
const moment = require('moment');
const countries = require('../utils/countries');

const SLEEP_TIME = 10; // not an option atm

const endpoint = argv.server ? `${argv.server}` : "http://localhost:2003";
console.log(`Using endpoint: ${endpoint} (--server overrides)`);

/* many agents can exist, this is curl, the simplest of all agents.
 * it optionally loads curl option from agents/curl.(json|yaml) */

function curlifyOptions(listof, testobj) {
  /* console.log(listof): 
  { options: [
    { option: '-A' },
    { option: 'Mozilla/5.0' },
    { option: '--proxy' },
    { option: '--proxy-user' },
    { option: 'country-code' },
    { variable: 'vantagePoint' },
    { append: 'something' }
  ]}, testobj is the scheduled object that describes the test */
  return _.reduce(listof.options, function(memo, entry) {
    if(entry.option) {
      memo.push(entry.option)
    } else if(entry.variable) {
      /* 'variable' take the last added string and add itself from
       * 'testobj */
      const l = memo.length;
      memo[l-1] += `${testobj[entry.variable]}`;
    } else if(entry.append) {
      /* 'append' take the string and append it to the last */
      const l = memo.length;
      memo[l-1] += `${entry.append}`;
    }
    return memo;
  }, []);
}

function checkLogFile(testobj) {
  const testId = testobj.testId; // the unique ID of the test
  const logfile = path.join('agents', 'logs', `${testId}.log`);

  if(!fs.existsSync(logfile)) {
    return {
      proceed: true,
      logfile
    } 
  } else {
    return {
      proceed: false,
      message: "Test already performed",
      logfile,
    }
  }
}
async function curl(logfile, testobj) {

  // remind rootoptions is a global variable
  const options = curlifyOptions(rootoptions, testobj);

  // the options comes from the configuration YAML
  const optionList = _.concat(options, [
    "-o",
    logfile,
    "-kis",
    testobj.href
  ]);

  debug("Starting child_process.spawn: %j", optionList);
  await spawn("curl", optionList);

  const countryIndex = countries.twocc.indexOf(testobj.vantagePoint);
  debug("Completed %s from %s (%s), log %s",
    testobj.href, testobj.vantagePoint,
    countries.namecc[countryIndex], logfile
  );

  return logfile;
}

async function validatePlatform(clinput) {
  /* this is quick and dirty but should be via API */
  const supported = ["tiktok", "youtube"];
  if(supported.indexOf(clinput) === -1) {
    console.log(`Platform invalid (${clinput}): supported ${supported}`);
    process.exit(1);
  }
  return clinput;
}

function validateTime(clinput) {
  return moment(new Date(clinput).toISOString()).format();
}

if(!argv.vantage) {
  console.log("You need to specify --vantage <TwoLetterCountryCode>");
  console.log("And this is not validated server side, so be mindful");
  process.exit(1);
}

if(argv.marker) {
  console.log(`--marker ${argv.marker} would be honored in shaping request`);
}

const twlcc = countries.validate(argv.vantage);

if(!argv.platform) {
  console.log("You need to specify --platform");
  process.exit(1);
}
const platformf = await validatePlatform(argv.platform);

if(!platformf || !twlcc) {
  console.log("Validation fail: --platform and --vantage is mandatory");
}

/*
-- scheduled provide a default and this option is not tested
if(!argv.time) {
  console.log("You might want to specify a HH:MM combo as --time, default is 00:00");
}
const timef = argv.time ? validateTime(argv.time) : moment().startOf('day');
*/

let response = null;
try {
  const isUp = await fetch(`${endpoint}/health`);
  const text = await isUp.text();
  if(isUp.status !== 200 || text !== 'OK')
    throw new Error("Unexpected server condition");

  const options = {
    "countryCode": twlcc,
    "platform": platformf
  };

  if(argv.marker)
    options.marker = argv.marker;

  /* if(timef) {
    debug("This option hasn't been tested");
    options.day = timef;
  } */

  const param = JSON.stringify(options);
  debug("Connecting to fetch scheduled tasks with (%s)", param);
  const connection = await fetch(`${endpoint}/scheduled/${param}`);
  response = await connection.json();
} catch(error) {
  console.log(`Submission server error at ${endpoint}: ${error.message}`);
  process.exit(1);
}

if(!response || !response.amount) {
  console.log(`No data retrieved with this options`);
  process.exit(1);
}

console.log(`Fetched ${response.amount} objects to connect`);

const rootoptions = yaml.parse(
  await fs.readFile(path.join('agents', 'curl.yaml'), 'utf-8')
);

/* normally the country code might be used to specift a proxy among your
 * curl options, or it might just be ignored because your agent only
 * asked for test that has to run from their own position */
debug("Options imported: %O", rootoptions.options);

for (const schobj of response.scheduled) {
  /* scheduled object is from the db/API
   * rootoptions is the agent/curl.yaml */
  debug("Connecting to %s: %s (%d)",
    schobj.platform, schobj.testId, schobj.iteration);

  const status = checkLogFile(schobj);
  let result = null;
  if(status.proceed) {
    result = await curl(status.logfile, schobj);
    debug("Connection complete sleep for %d seconds", SLEEP_TIME);
    await sleep(SLEEP_TIME * 1000);
  } else {
    console.log(`Not proceeding (${status.message})`);
    await sleep(500);
  }
  if(result) {
    console.log(`TODO handle ${result}`);
  }
}
