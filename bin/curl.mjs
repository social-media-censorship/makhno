#!node_modules/.bin/zx

import { argv, fs, path } from 'zx';
import logger from 'debug';
import _ from 'lodash';

// review const child_process = require('child_process');
const debug = logger('agent:curl');
const yaml = require('yaml');
const moment = require('moment');
const countries = require('../utils/countries');

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

async function curl(testobj, i) {
    const vantagePoint = testobj.vantagePoint; // the country code
    const targetURL = testobj.targetURL; // the destination URL to test
    const testId = testobj.testId; // the unique ID of the test

    if(!vantagePoint || !targetURL || !testId)
        throw new Error(`Incomplete content in scheduled object`);

    console.log(testobj);
    console.log(vantagePoint, targetURL, testId);

    const logfile = path.join('agents', 'logs', `${testId}.log`);
    const options = curlifyOptions(rootoptions, testobj);
    const optionString = _.concat(options, [
        "-o",
        logfile,
        "-kis",
        targetURL
    ]);
    console.log(optionString);
    const po = await $`curl ${optionString}`;

    // still WIP
    console.log(po);
    debug("%d> Completed %s (%s %d)",
        i, countries.namecc[vantagePoint],
        vantagePoint, stats.size);

    /* todo read output file */
    return logfile;
}

function validateCountryCode(clinput) {

}

async function validatePlatform(clinput) {

}

function validateTime(clinput) {
    return moment(new Date(clinput).toISOString()).format();
}

if(!argv.whoarewe && !argv.everywhere) {
    console.log("Note, using this command without --whoarewe <TwoLetterCountryCode> is dangerous");
    console.log("So you should specify --everywhenre if you really are so");
    process.exit(1);
}

const twlcc = argv.everywhere ? [] : validateCountryCode(argv.whoarewe);

if(!argv.platform) {
    console.log("You need to specify --platform");
    process.exit(1);
}
const platformf = await validatePlatform(argv.platform);

if(!argv.time) {
    console.log("You might want to specify a HH:MM combo as --time, default is 00:00");
}
const timef = argv.time ? validateTime(argv.time) : moment().startOf('day');

let scheduled = [];
try {
    const isUp = await fetch(`${endpoint}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
        throw new Error("Unexpected server condition");

    const param = JSON.stringify({
        "countryCodes": twlcc,
        "after": timef,
        "platform": platformf
    });
    debug("Connecting to fetch scheduled tasks with (%s)", param);
    const response = await fetch(`${endpoint}/scheduled/${param}`);
    scheduled = await response.json();
} catch(error) {
    console.log(`Submission server error at ${endpoint}: ${error.message}`);
    process.exit(1);
}

console.log(`Fetched ${scheduled.length} objects to connect`);

const rootoptions = yaml.parse(
    await fs.readFile(path.join('agents', 'curl.yaml'), 'utf-8')
);

/* normally the country code might be used to specift a proxy among your
 * curl options, or it might just be ignored because your agent only
 * asked for test that has to run from their own position */
debug("Options imported: %O", rootoptions.options);

for (const schobj of scheduled) {
    /* scheduled object is from the db/API
     * rootoptions is the agent/curl.yaml */
    const logfile = await curl(schobj, rootoptions);
    console.log(logfile);
}
