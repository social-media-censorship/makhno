#!node_modules/.bin/zx
import { argv } from 'zx';
import logger from 'debug';
import _ from 'lodash';

const debug = logger('bin:cleaner');

/* this script is meant to be used by administrator,
 * it allow to clean any collection based on any selector.
 * it was developed initially during the development, to remove
 * the scheduled collection by marker, and this use case is
 * the only one tested until this comment do not get updated */

function fetchAuthenticationMaterial() {
  // at the moment return a static string 
  return "³!A!STRING!³";
}

function loadSettings() {
  return {
    scheduled: `http://localhost:2003`,
  }
}

// Here is where the execution starts, the functions 
// try to have a self-explainatory name :)
console.log(`This tool deletes arbitrary documents from scheduled collection`);

if(!argv.vp) {
  console.log(`--vp (vantagePoint) is the only expected mandatory option`);
  process.exit(1);
}

const adminAuth = fetchAuthenticationMaterial();
const server = loadSettings();

const endpoint = server.scheduled;
try {
  const isUp = await fetch(`${endpoint}/health`);
  const text = await isUp.text();
  if(isUp.status !== 200 || text !== 'OK')
    throw new Error("Unexpected server condition");

  const payload = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth: adminAuth,
        selector: {
          vantagePoint: argv.vp
        }
      })
    };
  const response = await fetch(`${endpoint}/scheduled`, payload);
  if(response.status > 300) {
    const t = await response.text();
    console.log(`Error in pushing scheduled: ${response.status}: ${t}`);
    console.log("Quitting");
    process.exit(1);
  }
  const deleteret = await response.json();
  debug("flexibleDeleter: %O", deleteret);
} catch(error) {
  console.log(`flexibleDeleter error ${endpoint}: ${error.message}`);
  process.exit(1);
}
