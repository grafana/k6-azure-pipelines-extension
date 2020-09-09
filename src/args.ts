import tl = require('azure-pipelines-task-lib/task');

export interface IArgs {
  additional?: string;
  executionMode: 'cloud' | 'run';
  path: string;
  filename: string;
}

export function getArgs() {
  return {
    additional: tl.getInput('args', false),
    executionMode: tl.getBoolInput('cloud', false) ? 'cloud' : 'run',
    filename: tl.getInput('filename', false) || 'test.js',
    path: tl.getVariable('System.DefaultWorkingDirectory') as string,
  };
}
