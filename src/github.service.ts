import decompress from 'decompress';
import fs from 'fs';
import fetch from 'node-fetch';

const url = 'https://api.github.com/repos/loadimpact/k6/releases/latest';

export async function getDownloadUrl(release: string): Promise<string> {
  console.log(`Fetching download link for ${release}.`);
  return await fetch(url)
    .then((r) => r.json())
    .then((r) => r.assets)
    .then((r) => r.filter((x: any) => x.browser_download_url.includes(release)))
    .then((r) => r[0].browser_download_url)
    .catch((e) => {
      console.log('Could not determine download link. Exiting.');
      process.exit(1);
    });
}

export async function downloadAndUnpack(
  url: string,
  fileName: string,
  platform: string
) {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(fileName);
  await new Promise((resolve, reject) => {
    res.body?.pipe(fileStream);
    res?.body?.on('error', reject);
    fileStream.on('finish', resolve);
  });

  decompress(fileName, '.', {
    filter: (file) => file.path.includes('/k6'),
    map: (file) => {
      file.path = getFileName(platform);
      return file;
    },
  });
}
function getFileName(platform: string): string {
  return platform == 'win32' ? 'k6.exe' : 'k6';
}
