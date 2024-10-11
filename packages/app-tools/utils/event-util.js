import get from 'lodash/get.js';
import bourne from '@hapi/bourne'; // Used instead of JSON.parse to protect against protype poisoning
import crypto from 'node:crypto';

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

export function getMD5Hash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export function generateRandomPassword(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let password = '';

  // Use crypto to ensure secure random generation
  for (let i = 0; i < length - 3; i += 1) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    password += characters[randomIndex];
  }
  password += '@';
  for (let i = length - 2; i < length; i += 1) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    password += characters[randomIndex];
  }
  return password;
}
