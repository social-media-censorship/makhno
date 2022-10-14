#!node_modules/.bin/zx
import logger from 'debug';
const debug = logger('bin:systemCheckup');
import { spinner } from 'zx/experimental';

console.log(`This tool simply connects to all the implemented API and check if they works`);
console.log(`Plus initially initialized the dataset with some dummy working values`);

const ports = {
  gafam: 2001,
  submission: 2002,
  scheduled: 2003,
  results: 2004
};

const payloadsDir = path.join('tests', '_payloads');

async function report(retval, msg) {
  if(retval.size) {
    const r = await retval.json();
    debug("%s: %O", msg, r);
  }
}

async function testSubmission() {
  const server = `http://localhost:${ports.submission}`;
  const sfile = path.join(payloadsDir, 'submission.json')
  debug("Opening file %s");
  const submissionPayload = await fs.readJson(sfile);
  let payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submissionPayload)
  };

  /* ------------------------------- */
  debug("Sending submission payload %O", submissionPayload);
  await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (normal)"
  );

  await report(
    await fetch(`${server}/submission/${JSON.stringify({platform:'youtube'})}`),
    "GET submission (youtube normal URL only)"
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

  /* tiktok */
  submissionPayload.url = "https://www.tiktok.com/@rtl.sport/video/7154111468428856582";
  debug("Sending submission payload %O", submissionPayload);
  payload.body = JSON.stringify(submissionPayload);
  await report(
    await fetch(`${server}/submission`, payload),
    "POST to submission (tiktok video url)"
  );
}

async function testGAFAM() {
  const server = `http://localhost:${ports.gafam}`;
}

await spinner('testing Submission', () => testSubmission())
await spinner('testing GAFAM', () => testGAFAM());
