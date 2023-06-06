#!node_modules/.bin/zx

import logger from 'debug';
import _ from 'lodash';
const debug = logger('bin:detour-monolith');

const defaultVideoId = "jfKtPsjJRdk";
const videoId = argv.videoId || defaultVideoId;

if(videoId === defaultVideoId) {
    debug("you can use --videoId to specify a different videoId");
}

const submitted = await fetch('http://localhost:3000/submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        url:"https://www.youtube.com/watch?v=_bBShDevQZ0",
        countryCodes:["GA", "IE"],
        marker: "random-unnecessary-stuff"
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