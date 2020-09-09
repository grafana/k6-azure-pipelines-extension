<div align="center">
  
  <video
    src="https://k6.io/static/home-page-main-a1896f864698fb61d0ba4a0b2807837f.mp4" 
    type="video/mp4" 
    autoplay="true"
    loop="true"
    muted="true"
    playsinline
    width="600"
    style="pointer-events: none;">
  </video>

  </br>
  Open source load testing tool and SaaS for ambitious engineering teams.

</div>

## Getting started

It's as easy as:

```yaml
trigger:
  - master

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: k6-load-test@0
    inputs:
      filename: 'YOUR_K6_TEST_SCRIPT.js'
```

> ### ⚠️ Custom build agents
>
> To be able to run the k6 extension on a custom build agent, you need to
> have both `python` and `go` installed.

## Inputs

These options are also available from the settings dialog in the pipelines editor.

### Filename

```yaml
steps:
  - task: k6-load-test@0
    inputs:
      filename: 'YOUR_K6_TEST_SCRIPT.js'
```

Sets the filename of the test script to execute. This property is relative to the workspace directory.

### Cloud

```yaml
steps:
  - task: k6-load-test@0
    inputs:
      cloud: true
```

Enables execution in the k6 cloud. Additional details on the k6 cloud offering are available at https://k6.io/cloud/.
Using this requires you to also set up a secret variable in your pipeline named `K6_CLOUD_TOKEN`.

### Args

```yaml
steps:
  - task: k6-load-test@0
    inputs:
      args: --vus 10 --duration 10s
```

Any additional arguments to pass to the k6 cli. The full list of possible options is available at https://k6.io/docs/using-k6/options.

For additional information, and help getting started, see https://k6.io
