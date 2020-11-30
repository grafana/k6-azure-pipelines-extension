import { downloadAndUnpack, getDownloadUrl } from './github.service';
import { getRunnerInfo } from './runner.service';
import os from 'os';
import tl = require('azure-pipelines-task-lib/task');
import { existsSync } from 'fs';

export async function install() {
  const { release, platform } = getRunnerInfo();

  const downloadUrl = await getDownloadUrl(release);
  const fileName = extractFileNameFromDownloadUrl(downloadUrl);

  await downloadAndUnpack(downloadUrl, fileName, platform);
}

function extractFileNameFromDownloadUrl(downloadUrl: string) {
  const reg = /download\/.*\/(.*)$/.exec(downloadUrl);
  if (!reg) {
    console.log('Could not fetch download link. Exiting');
    process.exit(1);
  }

  const fileName = reg[1];
  return fileName;
}

export function isInstalled() {
  const platform = os.platform();
  try {
    tl.tool('k6').exec({ silent: true });
    console.log('k6 found using which');
    return true;
  } catch {
    const present = existsSync(platform === 'win32' ? 'k6.exe' : 'k6');
    if (present) {
      console.log('k6 found in the project root');
    }
  }
}
