import * as path from 'path';
import { getArgs } from './args';
import fetch from 'node-fetch';
import tl = require('azure-pipelines-task-lib/task');
// eslint-disable-next-line no-unused-vars
import tr = require('azure-pipelines-task-lib/toolrunner');
import { existsSync } from 'fs';
import decompress from 'decompress';
import { install, isInstalled } from './install.service';

import os from 'os';
import fs from 'fs';
import { exit } from 'process';

const args = getArgs();
const env = {
  ...process.env,
  GO11MODULE: 'on',
} as any;

const opts = { env, failOnStdErr: false } as any;

function init() {
  tl.setResourcePath(path.join(__dirname, 'task.json'));
  const token = tl.getVariable('K6_CLOUD_TOKEN');
  (env as any).K6_CLOUD_TOKEN = token;
}

async function run() {
  init();
  if (!(await isInstalled())) {
    await install();
  }
  try {
    let executor;

    if (os.platform() === 'win32') {
      executor = tl.tool('cmd').arg('/c').arg('k6');
    } else {
      process.env.PATH = `${args.path}:${process.env.PATH}`;
      executor = tl.tool('k6');
    }

    executor.arg(args.executionMode).arg(args.filename);

    if (args.additional) {
      executor.line(args.additional);
    }
    // eslint-disable-next-line no-console
    console.log('Starting k6');

    await executor.exec({
      env,
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
