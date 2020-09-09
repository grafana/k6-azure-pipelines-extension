import * as path from 'path';
import { getArgs } from './args';

import tl = require('azure-pipelines-task-lib/task');
// eslint-disable-next-line no-unused-vars
import tr = require('azure-pipelines-task-lib/toolrunner');

const args = getArgs();

function init() {
  tl.setResourcePath(path.join(__dirname, 'task.json'));

  // This really shouldn't be needed?
  const token = tl.getVariable('K6_CLOUD_TOKEN');
  process.env.K6_CLOUD_TOKEN = token;
}

async function install() {
  // eslint-disable-next-line no-console
  console.log('Downloading k6.');
  await tl
    .tool('go')
    .arg('get')
    .arg('-u')
    .arg('github.com/loadimpact/k6')
    .exec({
      failOnStdErr: true,
      cwd: args.path,
    } as tr.IExecOptions);
}

function isInstalled() {
  return tl.which('k6');
}

async function run() {
  try {
    init();

    if (!isInstalled()) {
      await install();
    }

    const go = tl
      .tool('go')
      .arg('run')
      .arg('github.com/loadimpact/k6')
      .arg(args.executionMode)
      .arg(args.filename);

    if (args.additional) {
      go.line(args.additional);
    }
    // eslint-disable-next-line no-console
    console.log('Starting k6');

    await go.exec({
      failOnStdErr: false,
      cwd: args.path,
    } as tr.IExecOptions);

    tl.setResult(tl.TaskResult.Succeeded, '');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    tl.setResult(tl.TaskResult.Failed, e.message);
  }
}

run();
