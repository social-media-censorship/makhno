#!node_modules/.bin/zx
import _ from 'lodash';
import { argv, question } from 'zx';
import { pickRandomTLCC } from '../utils/countries.js';

const endpoint = argv.server ? `${argv.server}` : "http://localhost:2002";
console.log(`Using endpoint: ${endpoint} (--server overrides)`);

if(!argv.url) {
  console.log("This tool is meant to submit an --url and can't work without");
  process.exit(1);
}

if(!argv.marker) {
  console.log("This tool needs a --marker and can't work without");
  process.exit(1);
}

let cc = [];
if(!argv.cc) {
  console.log("Missing --cc (country code, in two letter)");
  const proposed = await question("Do you want to specify it? empty means random: ");
  if(proposed.length)
    cc = [ proposed ];
  else {
    cc = [ pickRandomTLCC(), pickRandomTLCC() ];
    console.log(`Picker random Countries: ${cc}`);
  }
}

try {
  const isUp = await fetch(`${endpoint}/health`);
  const text = await isUp.text();
  if(isUp.status !== 200 || text !== 'OK')
    throw new Error("Unexpected server condition");
} catch(error) {
  console.log(`Submission server error at ${server}: ${error.message}`);
  process.exit(1)
}

const payload = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "url": argv.url,
    "countryCodes": cc,
    "marker": argv.marker,
  })
};

const r = await fetch(`${endpoint}/submission`, payload)

if(r.status > 300) {
  /* in this case we are in a 4XX 5XX error */
  const errorMessage = await r.text();
  console.log(`Error ${r.status}: ${errorMessage}`);
  process.exit(1);
} 

if(r.status === 202) {
  console.log("That URL was already present so has not been inserted");
  // or should have updated the CC ? or the creationTime ? TBD
  process.exit(1)
}

const report = await r.json();
console.log(report);
