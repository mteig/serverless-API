import {
  processEvent,
  RepositoryFactory,
  generateAccessTokenFromRefreshToken,
  generateRefreshToken,
  log,
} from 'app-tools';

const COMMAND_NAME = 'RefreshToken';

export default async function refreshToken(event, context) {
  const { queryStringParameters, headers } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const result = { success: false, statusCode: 400 };
  try {
    const { userid } = queryStringParameters;
    if (!userid) {
      result.message = 'User id is required';
      return result;
    }
    if (!headers.Authorization) {
      result.message = 'Authorization header is required';
      result.statusCode = 401;
      return result;
    }
    const token = headers.Authorization.split(' ')[1];
    const userRepo = new RepositoryFactory().getUserRepo();
    const user = await userRepo.getUserById(userid);
    result.accessToken = await generateAccessTokenFromRefreshToken(token, user);
    result.refreshToken = await generateRefreshToken(user, token);
    result.success = true;
    result.statusCode = 200;
    result.id = user.userid;
    result.refresh_location = true;
  } catch (error) {
    log.error(error);
    result.message = error.message || 'Internal server error';
  }
  return result;
}
