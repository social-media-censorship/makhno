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

async function testSubmission() {
  const server = `http://localhost:${ports.submission}`;
  const sfile = path.join(payloadsDir, 'submission.json')
  const submissionPayload = await fs.readJson(sfile);
  debug("Opening %s read %O submission", sfile, submissionPayload);
  let payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submissionPayload)
  };

  const c1 = await fetch(`${server}/submission`, payload);
  if(c1.size) {
    const r = await c1.json();
    debug("POST to submission (normal): %O", r);
  }

  const c2 = await fetch(`${server}/submission/${JSON.stringify({platform:'youtube'})}`);
  if(c2.size) {
    const r = await c2.json();
    debug("GET submission (youtube normal URL only): %O", r);
  }

  /* update the previously used payload with other two URLs */
  submissionPayload.url = "https://www.youtube.com/shorts/IX3nMJaUS-Q";
  payload.body = JSON.stringify(submissionPayload);
  const c3 = await fetch(`${server}/submission`, payload);
  if(c3.size) {
    const r = await c3.json();
    debug("POST to submission (short): %O", r);
  }

  submissionPayload.url = "https://youtu.be/n61ULEU7CO0";
  payload.body = JSON.stringify(submissionPayload);
  const c4 = await fetch(`${server}/submission`, payload);
  if(c4.size) {
    const r = await c4.json();
    debug("POST to submission (url shortened): %O", r);
  }

}

async function testGAFAM() {
  const server = `http://localhost:${ports.gafam}`;
}

await spinner('testing Submission', () => testSubmission())
await spinner('testing GAFAM', () => testGAFAM());
