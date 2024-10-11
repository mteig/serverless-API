import {
  middify,
  log,
  processEvent,
  createResponse,
  verifyAccessToken,
  RepositoryFactory,
} from 'app-tools';
import login from './commands/login.js';
import refreshToken from './commands/refresh-token.js';
import forgotPassword from './commands/forgot-password.js';
import updateLocation from './commands/update-location.js';
import logout from './commands/logout.js';

const authenticatedRoutes = {
  UpdateLocation: updateLocation,
};

const unauthenticatedRoutes = {
  Login: login,
  RefreshToken: refreshToken,
  ForgotPassword: forgotPassword,
  Logout: logout,
};

const innerHandler = async (event, context) => {
  const { queryStringParameters, headers } = processEvent(event);
  let result = { success: false, statusCode: 400 };
  const { command, userid } = queryStringParameters;
  if (!command) {
    result.message = 'Command is required';
    return createResponse(result);
  }
  let user;
  if (authenticatedRoutes[command]) {
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
  if (userid) {
    const userRepo = new RepositoryFactory().getUserRepo();
    user = await userRepo.getUserById(userid);
  }
  try {
    if (authenticatedRoutes[command]) {
      result = await authenticatedRoutes[command](event, context, user);
    } else if (unauthenticatedRoutes[command]) {
      result = await unauthenticatedRoutes[command](event, context);
    } else {
      result.message = 'Invalid command';
      log.error({ command, queryStringParameters }, 'Invalid command');
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
