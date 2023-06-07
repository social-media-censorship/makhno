#!node_modules/.bin/zx

import logger from 'debug';
import _ from 'lodash';
import { pickRandomTLCC } from '../utils/countries.js';

const debug = logger('bin:detour-monolith');

const defaultVideoId = "jfKtPsjJRdk";
const videoId = argv.videoId || defaultVideoId;

const server = argv.local ? 'http://localhost:3000' : 'https://makhno.net';

if(videoId === defaultVideoId) {
    debug("you can use --videoId to specify a different videoId");
}

const submitted = await fetch(`${server}/submission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        countryCodes:  _.times(_.random(1, 4), (i) => {
            return pickRandomTLCC();
        }),
        marker: "set-by-advanced-options"
    })
});

// now the backend has the URL and should handle the conditions 
// https://github.com/uradotdesign/makhno-website/issues/4
// here expressed.
// The printout below should display the three cases.

const answer1 = await submitted.json();
debug("Received after submission %O", answer1);

if(_.isBoolean(_.get(answer1, 'inserted'))) {
    console.log("You should use bin/populate-results.mjs now, and repeat previous command");
}