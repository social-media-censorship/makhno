#!node_modules/.bin/zx

import logger from 'debug';
import _ from 'lodash';
import moment from 'moment';
import { computeId } from '../utils/various.js';

const debug = logger('bin:popolate-results');

console.log("This script will fetch all the submissions and create a dummy result");

const submissions = await fetch('http://localhost:3000/submission/all/1');
const answer1 = await submissions.json();

debug("Available to mock are %d submissions", answer1.length);

/* I've a small conflict here between web and database */
const statuses = {
    "notfound": "validation not possible",
    "explicit": "not reachable",
    "accessible": "reachable",
}

for (const submission of answer1) {

    const base = {
        submissionId: submission.id,
        platform: submission.platform,
        targetURL: submission.href,
        iteration: _.random(0, 10),
        testId: computeId(`${submission.submissionId}-${_.random(0, 0xffff)}`),
        testTime: moment().subtract(_.random(0, 72), 'hours').format("YYYY-MM-DD"),
    }

    debug("Producing %d entries for %s",
        submission.countryCodes.length, submission.submissionId);

    for(const countryCode of submission.countryCodes) {
        const result = _.clone(base);
        result.countryCode = countryCode;
        result.status = _.sample(_.values(statuses));

        fetch('http://localhost:3000/results/', {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([result]),
        });
    }
}