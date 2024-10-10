import {
  middify,
  log,
  processEvent,
  createResponse,
  verifyAccessToken,
} from 'app-tools';
import login from './commands/login.js';
import refreshToken from './commands/refresh-token.js';

const innerHandler = async (event, context) => {
  const { queryStringParameters, headers } = processEvent(event);
  let result = { success: false, statusCode: 400 };
  const { command, userid } = queryStringParameters;
  if (!command) {
    result.message = 'Command is required';
    return createResponse(result);
  }
  const unauthRoutes = ['login', 'refresh-token'];
  if (!unauthRoutes.includes(command)) {
    log.info({ headers }, 'command::headers::tiger-servlet');
    if (!headers.Authorization) {
      result.message = 'Authorization header is required';
      result.statusCode = 401;
      return createResponse(result);
    }
    const token = headers.Authorization.split(' ')[1];
    const authSuccess = verifyAccessToken(token, userid);
    if (!authSuccess) {
      result.message = 'Invalid access token';
      result.statusCode = 401;
      return createResponse(result);
    }
  }
  try {
    switch (command) {
      case 'login': {
        result = await login(event, context);
        break;
      }
      case 'refresh-token': {
        result = await refreshToken(event, context);
        break;
      }
      default: {
        result.message = 'Invalid command';
        log.error({ command, queryStringParameters }, 'Invalid command');
        break;
      }
    }
  } catch (error) {
    log.error(
      { error, errorMessage: error.message, stack: error.stack },
      'command::error::tiger-servlet'
    );
    result.message = 'Internal server error';
  }
  return createResponse(result);
};

export const handler = middify(innerHandler);
