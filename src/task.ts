import * as path from 'path';
import { getArgs } from './args';
import 'isomorphic-fetch';
import tl = require('azure-pipelines-task-lib/task');
// eslint-disable-next-line no-unused-vars
import tr = require('azure-pipelines-task-lib/toolrunner');
import { existsSync } from 'fs';

const args = getArgs();

function init() {
  tl.setResourcePath(path.join(__dirname, 'task.json'));
  const token = tl.getVariable('K6_CLOUD_TOKEN');
  process.env.K6_CLOUD_TOKEN = token;
}

async function install() {
  const url = 'https://api.github.com/repos/loadimpact/k6/releases/latest';
  let tagName;

  await fetch(url)
    .then((r) => r.json())
    .then((r) => (tagName = r.tag_name))
    .catch(() =>
      console.log('Could not fetch the latest release version from GitHub.')
    );

  tagName = tagName || 'latest';
  console.log(
    tagName === 'latest'
      ? "Falling back to using 'latest'."
      : "Latest release is '" + tagName + "'"
  );

  console.log("Making sure it's installed");
  const env = {
    GO11MODULE: 'on',
    HOME: __dirname,
  };

  const opts = { env, failOnStdErr: false } as any;
  if (existsSync('go.mod')) {
    console.log('Go mod file present');
  } else {
    console.log('Initializing go mod file');
    await tl.tool('go').arg(['mod', 'init', 'k6.io/void']).exec(opts);
  }

  tl.tool('go')
    .arg(['get', '-u', `github.com/loadimpact/k6@${tagName}`])
    .exec(opts);
}

async function run() {
  try {
    init();
    await install();

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
