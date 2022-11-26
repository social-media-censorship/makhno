#!node_modules/.bin/zx
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs, path } from 'zx';
import Airtable from 'airtable';
import logger from 'debug';

const debug = logger('bin:airtable-fetcher');

if(!argv.marker) {
  console.log(`--marker is mandatory to distinguish manual import from other submission`);
  process.exit(1)
}

const settingsf = path.join('config', 'airtable.json');
const settings = await fs.readJSON(settingsf);

Airtable.configure({
  apiKey: settings.airtable_key,
});

const base = new Airtable().base(settings.airtable_base);
const table = base.table(settings.airtable_table);

const d = await table.select().all();
const dati = _.map(d, 'fields');
const urls = _.map(dati, 'Link');
debug("Imported from table %d links", urls.length);

/* below it start piece of code used to interact with makhno */
const { report } = require('../utils/cli');

submitAll(urls).then(function(added) {
  debug("Added %O", added);
});

async function submitAll(urls) {
  const server = (!!argv.remote) ?
    "https://makhno.net" : "http://localhost:2002";
  debug("Using submission endpoint: %s", server);
  try {
    const isUp = await fetch(`${server}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Server not found reachable");

    debug("Server reachable, starting to submit %d urls", urls.length);
    const added = [];
    for(const url of urls) {
      const x = await submit(url, server);
      if(x.submission)
        added.push(x.submission);
      else
        debug("Unexected return value for %s: %O", url, x);
    }
    return added;
  } catch(error) {
    console.log(`Submission server error at ${server}: ${error.message}`);
  }
}

async function submit(url, server) {
  const body = {
    url,
    marker: argv.marker,
    countryCodes: [
      "QA", // Qatar
      "NL", // Netherlands
      "SA", // Saudi Arabia
      "SE"  // Sweden
    ]
  };
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  return await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (normal)"
  );

}
