import os from 'os';

export function getRunnerInfo() {
  const platform = os.platform();
  const arch = os.arch();
  const runner = `${platform}/${arch}`;
  console.log(`Currently running on ${runner}`);

  return {
    runner,
    arch,
    platform,
    release: convertArchAndPlatformToK6Release(runner),
  };
}

function convertArchAndPlatformToK6Release(runner: string) {
  switch (runner) {
    case 'win32/x64':
      return 'windows-amd64';
    case 'linux/x64':
      return 'linux-amd64';
    case 'linux/arm64':
      return 'linux-arm64';
    case 'darwin/x64':
      return 'macos-amd64';
    case 'darwin/arm64':
      return 'macos-arm64';
    default:
      console.log(
        `${runner} is not a supported infrastructure. ` +
          `Please open an issue at https://github.com/k6io/azure-pipelines-extension/`
      );
      process.exit(1);
  }
}
