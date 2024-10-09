import get from 'lodash/get.js';
import bourne from '@hapi/bourne'; // Used instead of JSON.parse to protect against protype poisoning

import { log } from './log.js';

/*
 * Utilities for Lambda events
 */

export function processEvent(event) {
  const {
    body,
    pathParameters,
    queryStringParameters,
    requestContext,
    headers,
  } = event;
  const { httpMethod, resourceId, resourcePath, requestId } = requestContext;
  let user;
  try {
    user = bourne.parse(get(requestContext, 'authorizer.user', {}));
  } catch {}
  log.debug(
    { resourceId, resourcePath, requestId, httpMethod, user },
    'Request received'
  );

  return {
    body: typeof body === 'string' ? bourne.parse(body) : body,
    queryStringParameters,
    pathParameters,
    user,
    headers,
  };
}
