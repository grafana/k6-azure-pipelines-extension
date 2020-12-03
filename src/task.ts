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
  PATH: __dirname + ':' + process.env.PATH,
  GO11MODULE: 'on',
};

const opts = { env, failOnStdErr: false } as any;

function init() {
  tl.setResourcePath(path.join(__dirname, 'task.json'));
  const token = tl.getVariable('K6_CLOUD_TOKEN');
  (env as any).K6_CLOUD_TOKEN = token;
}

async function run() {
  init();
  if (!isInstalled()) {
    await install();
  }

  try {
    const go = tl
      .tool(os.platform() == 'win32' ? 'k6.exe' : 'k6')
      .arg(args.executionMode)
      .arg(args.filename);

    if (args.additional) {
      go.line(args.additional);
    }
    // eslint-disable-next-line no-console
    console.log('Starting k6');

    await go.exec({
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
