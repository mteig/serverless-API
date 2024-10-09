#!/bin/bash

set -Eeuxo pipefail

source build-scripts/assume-cross-account-role.env
cd packages/"${MODULE_NAME}"
if [ "${MODULE_NAME}" == "certs" ]; then
  # serverless will override provider.stage with the `--region` setting but `certs` must be deployed in ap-south-1
  TARGET_REGION="ap-south-1"
fi

../../node_modules/serverless/bin/serverless.js deploy --stage ${APP_STAGE} --region ${TARGET_REGION} --force
