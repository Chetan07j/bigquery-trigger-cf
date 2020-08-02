# Cloud Function To Execute BigQuery Queries/Job

![Node](https://img.shields.io/badge/node-v10.19.0+-green.svg) ![NPM](https://img.shields.io/badge/npm-v6.14.5+-blue.svg)

This _Cloud Function_ is triggered on **Cloud Storage(Finalize/Create)** event, which then in turn calls/invokes BigQuery statements.

### Yarn Installation
Follow respective OS specific installation
- [Windows](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
- [Debian/Ubuntu](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
- [macOS](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

## Usage

1. Get this repository in local
    ```shell
    git clone git@github.com:Chetan07j/bigquery-trigger-cf.git
    ```

2. Enter into folder created from clone
    ```shell
    cd bigquery-trigger-cf
    ```

3. Install `npm` dependencies
    ```shell
    yarn install
    ```
4. Run Application
    - Pre-requisites
      ```js
      // in app.js at the end add this (copy as it is) and save
      const event = { bucket: '<trigger-bucket-name>', name: '<file-name-present-in-bucket>'}; // Make sure bucket and file exists
      const context = { eventId: '324242d2f'}; // For testing eventId can be random

      bigQueryJob(event, context);
      ```

    - Then open terminal/cmd and run this command
      ```shell
      # Update values for placeholders `<>` accordingly
      STAGING_DATASET=<STAGING_DATASET> STAGE_TABLE=<STAGE_TABLE> CORE_DATASET=<CORE_DATASET> CORE_TABLE=<CORE_TABLE> yarn start
    ```

## Eslint

_Check and fix eslint issues_

1. Check for `eslint` issues in code
    ```sh
    yarn run lint
    ```

2. Fix auto fixable `eslint` issues
    ```sh
    yarn run lint:fix
    ```

## Test

1. Run test using
    ```sh
    yarn test
    ```

2. Test coverage
    ```shell
    yarn run test-coverage
    ```

## Sonar Analysis

    ```sh
    yarn run sonar \
        -Dsonar.projectKey=bigquery-trigger-cf \
        -Dsonar.projectName=bigquery-trigger-cf \
        -Dsonar.host.url=localhost:9000 \
        -Dsonar.login=<SONAR-LOGIN-TOKEN> \
        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
        -Dsonar.exclusions=test/**,config/** \
        -Dsonar.eslint.reportPaths=eslint-report.json \
        -Dsonar.verbose=true \
        -Dsonar.log.level=DEBUG
    ```

## Logger

For logging `winston` logger is used along with `@google-cloud/logging-winston` with stackdriver support.

1. Logging example:
    ```js
    logger.info('Test log added');

    logger.error('Error log added');
    ```

2. Log format:
    - Single Line:

      `timestamp-[process.pid]-${app}-${mod}-level.charAt(0)-filename- msg [if error(-stack: stack)]`

      example:
      ```shell
      2020-07-08T12:11:35.372Z-[26720]-TFA-BQT_CF-I-bigquery-trigger-cf/app.js- Test log added.
      ```

    - JSON:
      ```js
      {
        "app": "APP",
        "module": "BQT_CF",
        "processPID": "xxxx",
        "level": "INFO",
        "file": "abc.js",
        "msg": "meesgae",
        "ts": "2020-07-08T12:11:35.378Z",
        // Optional fields when error is logged
        "function": "myFunction",
        "line": 123,
        "stack": "<STACK-TRACE>",
      }
      ```

## Environment Variables

| Variable                |                                           Description                                           | Type     |
| ------------------------| ----------------------------------------------------------------------------------------------- | -------- |
| **`DATASET`**           | Dataset name in which table exists                                                              | `string` |
| **`TABLE`**             | Record table name                                                                              | `string` |
| **`LOCATION`**          | Location in which BigQuery dataset exists                                                       | `string` |
| **`STACKDRIVER_LOGGER`**| If set to true then logs will be printed to `Stackdriver` else `console` transportar is set     | `string` |
| **`JSON_LOG`**          | If set to true then JSON logs will be printed or single line                                    | `string` |

> You can find values to above env variables in cloud-build config

## Deploy Cloud Function

_To deploy cloud function from your local execute below command._

```sh
gcloud functions deploy <FUNCTION-NAME-TO-DISPLAY> \
  --project=<GCP-PROJECT-NAME> \
  --region=europe-west1 \
  --source=. \
  --trigger-resource=<STORAGE-BUCKET-ON-WHICH-TRIGGER-TO-APLLY> \
  --trigger-event=google.storage.object.finalize \
  --runtime=nodejs10 \
  --service-account=<SERVICE-ACCOUNT-TO-BIND-TO-CF> \
  --env-vars-file=<YAML-FILE-HOLDING-ENV-VALUES> \
  --retry
```

## Configuration Options

Cloud functions must be enabled in the GCP project.
