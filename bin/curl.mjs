#!node_modules/.bin/zx

import { argv, fs, path } from 'zx';
import logger from 'debug';
import _ from 'lodash';

// review const child_process = require('child_process');
const debug = logger('agent:curl');
const yaml = require('yaml');
const countries = require('../utils/countries');

const endpoint = argv.server ? `${argv.server}` : "http://localhost:2002";
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
      { variable: 'cc' },
      { append: 'something' }
    ]} */
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

async function curl(testobj, options) {
    const cc = testobj.cc; // the country code 
    const targetURL = testobj.targetURL; // the destination URL to test
    const id = testobj.id; // the unique ID of the test 

    const logfile = path.join('agents', 'logs', `${id}.log`);


    const optionString = _.join(_.concat(options, [
        "-kis",
        targetURL,
        "-o",
        logfile
    ]), ' ');
    console.log(optionString);
    const po = await $`curl ${optionString}`;

    debug("%d> Completed %s (%s %d)", cindex,
        countries.namecc[cindex], cc, stats.size);

    /* todo read output file */
    return logfile;
}

function validateCountryCode(clinput) {

}

async function validatePlatform(clinput) {

}

function validateTime(clinput) {

}

/* normally the country code might be used to specift a proxy among your
    * curl options, or it might just be ignored because your agent only 
    * asked for test that has to run from their own position */
const options = curlifyOptions(
    yaml.parse(
        await fs.readFile(
            path.join('agents', 'curl.yaml'),
            'utf-8')
    ), testobj
);
debug("Options imported: %O", options);

if(!argv.whoarewe || !argv.everywhere) {
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
const timef = argv.time ? validateTime(argv.time) : '00:00';

let scheduled = [];
try {
    const isUp = await fetch(`${endpoint}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
        throw new Error("Unexpected server condition");

    const param = JSON.stringify({
        "countryCodes": twlcc,
        "time": timef,
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

for (const schobj of scheduled) {
    const logfile = await curl(schobj, options);

}
