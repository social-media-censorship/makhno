#!node_modules/.bin/zx
import logger from 'debug';
const debug = logger('bin:systemCheckup');
import { spinner } from 'zx/experimental';
import _ from 'lodash';

/* the code is actually executed at the end */

const ports = {
  gafam: 2001,
  submission: 2002,
  scheduled: 2003,
  results: 2004
};

const payloadsDir = path.join('tests', '_payloads');

async function report(retval, msg) {

  if(retval.status > 300) {
    /* in this case we are in a 4XX 5XX error */
    const errorMessage = await retval.text();
    debug("Error (%d): %s: %s", retval.status, msg, errorMessage);
    return;
  }

  const r = await retval.json();
  if(JSON.stringify(r).length > 2) {
    debug("(%d) %s: %d bytes (keys: %d)", retval.status, msg,
      JSON.stringify(r).length, _.keys(r).length);
  } else
    debug("Empty answer, HTTP status code: %d", retval.status);
}

const payload = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: null
};

async function testSubmission(server) {
  const sfile = path.join(payloadsDir, 'submission.json')
  debug("Opening file %s");
  const submissionPayload = await fs.readJson(sfile);
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

async function testGAFAM(server) {
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
    await testSubmission(server);
  } catch(error) {
    console.log(`Submission server error at ${server}: ${error.message}`);
  }
}

async function wrapTestGAFAM() {
  const server = `http://localhost:${ports.gafam}`;
  try {
    const isUp = await fetch(`${server}/health`);
    const text = await isUp.text();
    if(isUp.status !== 200 || text !== 'OK')
      throw new Error("Unexpected server condition");
    await testGAFAM(server);
  } catch(error) {
    console.log(`GAFAM server error at ${server}: ${error.message}`);
  }
}


// Here is where the execution starts:
console.log(`This tool simply connects to all the implemented API and check if they works`);
console.log(`Plus initially initialized the dataset with some dummy working values`);
await wrapTestSubmission();
await wrapTestGAFAM()
