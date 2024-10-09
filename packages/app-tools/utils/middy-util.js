import AWSXRay from 'aws-xray-sdk-core';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import ssm from '@middy/ssm';
import inputOutputLogger from '@middy/input-output-logger';

import { log } from './log.js';

export function middify(handler, options = {}) {
  const innerHandler = middy(handler).use(
    inputOutputLogger({
      logger: (request) => {
        log.debug({ request }, 'request');
      },
    })
  );

  // eslint-disable-next-line consistent-return
  innerHandler.before((request) => {
    if (request.event && request.event.source === 'serverless-plugin-warmup') {
      log.info({ event: request.event }, 'WarmUP - Lambda is warm!');
      return { statusCode: 200, body: 'Lambda is warm!' };
    }
  });

  if (options.isHttpHandler) {
    AWSXRay.captureAWS(AWS);
    innerHandler.use([
      httpEventNormalizer(),
      httpJsonBodyParser(),
      httpCors(),
      httpErrorHandler(),
    ]);
  }

  // TODO: add tests for this
  /* c8 ignore start */
  if (options.ssmParameters && process.env.APP_STAGE !== 'test') {
    innerHandler.use(
      ssm({
        fetchData: options.ssmParameters,
        awsClientOptions: {
          endpoint: process.env.SSM_ENDPOINT_URL,
        },
        setToContext: true,
      })
    );
  }

  return innerHandler;
}
