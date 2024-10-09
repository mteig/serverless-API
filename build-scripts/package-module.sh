#!/bin/bash

set -Eeuxo pipefail

source build-scripts/assume-cross-account-role.env
cd packages/"${MODULE_NAME}"
echo "Packaging for APP_STAGE ${APP_STAGE}"
mkdir -p build-artifacts/${APP_STAGE}
APP_STAGE=${APP_STAGE} ../node_modules/serverless/bin/serverless.js package \
  --region ${TARGET_REGION} \
  --package build-artifacts/${APP_STAGE} \
  --stage ${APP_STAGE} \
  -v
