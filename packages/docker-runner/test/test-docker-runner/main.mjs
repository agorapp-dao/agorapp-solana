import https from 'https';
import { exec } from 'child_process';
import util from 'util';

const pExec = util.promisify(exec);

async function main() {
  let args;
  try {
    args = JSON.parse(process.env.DOCKER_RUNNER_ARGS);
  } catch (err) {
    throw new Error(`Failed to parse DOCKER_RUNNER_ARGS. Make sure env var is set and it is a valid JSON.`);
  }

  if (!args.action) {
    throw new Error(`DOCKER_RUNNER_ARGS must contain an action property.`);
  }

  switch (args.action) {
    case 'testStdOut':
      await testStdOut();
      break;
    case 'testNetwork':
      await testNetwork();
      break;
    case 'testPing':
      await testPing();
      break;
    case 'testResult':
      await testResult();
      break;
    case 'testTimeout':
      await testTimeout();
      break;
    case 'testMemoryLimit':
      await testMemoryLimit();
      break;
    default:
      throw new Error(`Unknown action ${args.action}`);
  }
}
main();

function testStdOut() {
  console.log('stdout: hello');
}

async function testNetwork() {
  return new Promise((resolve, reject) => {
    try {
      const req = https.request('https://www.google.com', (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        resolve();
      });
      req.on('error', reject)
      req.end();

    } catch (err) {
      reject(err);
    }
  });
}

async function testPing() {
  const res = await pExec('ping -c 1 8.8.8.8');
  console.log('ping stdout: ' + res.stdout);
  console.log('ping stderr: ' + res.stderr);
}

async function testResult() {
  console.log(`DOCKER_RUNNER_RESULT=${JSON.stringify({ passed: true })}`)
}

async function testTimeout() {
  await sleep(30_000);
}

async function testMemoryLimit() {
  console.log('allocate memory');
  let buffer = Buffer.alloc(60 * Math.pow(1024, 2));
  for (let i = 0; i < buffer.length; i++) {
    buffer.writeUInt8(i % 256, i);
  }

  console.log('memory allocated');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
