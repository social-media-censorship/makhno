#!node_modules/.bin/zx
import logger from 'debug';
import _ from 'lodash';

const debug = logger('bin:detour-everything'); // well, "nearly" everything
const { report } = require('../utils/cli');
const { twocc } = require('../utils/countries');

/* the code is executed at the end,
 * on top there are declarations and functions */

const ports = {
  gafam: 2001,
  submission: 2002,
  scheduled: 2003,
  results: 2004
};

const payloadsDir = path.join('tests', '_payloads');

const payload = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: null
};

async function interactWithScheduledAPI(server) {

  const sfile = path.join(payloadsDir, 'scheduled.json')
  debug("Opening file %s");
  const scheduledo = await fs.readJson(sfile);

  const scheduledPayload = _.flatten(_.times(6, function(i) {
    return _.map(twocc, function(countryCode) {
      const o = _.clone(scheduledo);
      o.iteration = i;
      o.vantagePoint = countryCode;
      o.testId = `${o.testId.substring(0, 37)}${i}${countryCode}`;
      return o;
    });
  }));
  payload.body = JSON.stringify({
    auth: "³!A!STRING!³",
    scheduled: scheduledPayload
  })

  debug("Sending scheduled payload %d objects!", scheduledPayload.length);
  await report(
    await fetch(`${server}/scheduled`, payload),
    "POST to scheduled"
  );
  await report(
    await fetch(`${server}/scheduled/${JSON.stringify({platform:'tiktok'})}`),
    "GET to scheduled"
  );

}

async function interactWithResultsAPI(server) {

}

async function interactWithSubmissionAPI(server) {
  const sfile = path.join(payloadsDir, 'submission.json')
  debug("Opening file %s");
  const submissionPayload = await fs.readJson(sfile);
  submissionPayload.marker = 'detour';
  payload.body = JSON.stringify(submissionPayload)

  /* ------------------------------- */
  debug("Sending submission payload %O", submissionPayload);
  await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (normal)"
  );

  /* update the previously used payload with other two URLs */
  submissionPayload.url = "https://www.youtube.com/shorts/IX3nMJaUS-Q";
  debug("Sending submission payload %O", submissionPayload);
  payload.body = JSON.stringify(submissionPayload);
  await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (short)"
  );

  submissionPayload.url = "https://youtu.be/n61ULEU7CO0";
  debug("Sending submission payload %O", submissionPayload);
  payload.body = JSON.stringify(submissionPayload);
  await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (url shortened)"
  );

  /* read the submission just made */
  debug("Reading existing submission from youtube");
  await report(
    await fetch(`${server}/submission/${JSON.stringify({platform:'youtube'})}`),
    "GET submission (youtube platform)"
  );

  /* tiktok */
  submissionPayload.url = "https://www.tiktok.com/@rtl.sport/video/7154111468428856582";
  debug("Sending submission payload %O", submissionPayload);
  payload.body = JSON.stringify(submissionPayload);
  await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (tiktok video url)"
  );

  debug("Reading existing submission from tiktok");
  await report(
    await fetch(`${server}/submission/${JSON.stringify({platform:'tiktok'})}`),
    "GET submission (tiktok platform)"
  );
}

async function interactWithGAFAMAPI(server) {
  const files = [
    'invalidYTChannel.html',
    'validYTChannel.html',
    'blockedYTChannel.html',
  ];
  debug("Submitting %d files", files.length);

  for(const file of files) {
    const filepath = path.join(payloadsDir, file);
    const html = fs.readFileSync(filepath, 'utf-8');
    payload.body = JSON.stringify({
      html,
      source: 'curl',
      targetURL: `www.youtube.com/channel/IGNORED-${file.replace(/\.html/, '')}`,
      countryCode: "IO",
    });

    debug("Sending HTML of [%s] to the GAFAM parse API", file);
    await report(
      await fetch(`${server}/gafam/parse`, payload),
      `POST ${file} to API /gafam/parse`
    );
  }

}

async function wrapTestSubmission() {
  const server = `http://localhost:${ports.submission}`;
  try {
    const isUp = await fetch(`${server}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");
    await interactWithSubmissionAPI(server);
  } catch(error) {
    console.log(`Submission server error at ${server}: ${error.message}`);
  }
}

async function wrapTestScheduled() {
  const server = `http://localhost:${ports.scheduled}`;
  try {
    const isUp = await fetch(`${server}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");
    await interactWithScheduledAPI(server);
  } catch(error) {
    console.log(`Scheduled server error at ${server}: ${error.message}`);
  }
}

async function wrapTestGAFAM() {
  const server = `http://localhost:${ports.gafam}`;
  try {
    const isUp = await fetch(`${server}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");
    await interactWithGAFAMAPI(server);
  } catch(error) {
    console.log(`GAFAM server error at ${server}: ${error.message}`);
  }
}

async function wrapTestResults() {
  const server = `http://localhost:${ports.results}`;
  try {
    const isUp = await fetch(`${server}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");
    await interactWithResultsAPI(server);
  } catch(error) {
    console.log(`Results server error at ${server}: ${error.message}`);
  }
}

// Here is where the execution starts:
console.log(`This tool simply connects to all the implemented API and check if they works`);
console.log(`Plus initially initialized the dataset with some dummy working values`);
await wrapTestSubmission();
await wrapTestScheduled();
process.exit(1)
await wrapTestGAFAM();
await wrapTestResults();
