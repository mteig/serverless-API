import {
  dbManager,
  hashToken,
  processEvent,
  RepositoryFactory,
  verifyRefreshToken,
  log,
} from 'app-tools';

const COMMAND_NAME = 'Logout';

export default async function logout(event, context) {
  const result = { success: false, statusCode: 400 };
  const { queryStringParameters, headers } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const { userid } = queryStringParameters;
  if (!userid) {
    result.message = 'User not found';
    return result;
  }
  if (!headers.Authorization) {
    result.message = 'Authorization header is required';
    result.statusCode = 401;
    return result;
  }
  const token = headers.Authorization.split(' ')[1];
  const verified = await verifyRefreshToken(token, userid);
  if (!verified) {
    result.message = 'Invalid refresh token';
    result.statusCode = 401;
    return result;
  }
  const userRepo = new RepositoryFactory().getUserRepo();
  const userPinsRepo = new RepositoryFactory().getUserPinsRepo();
  const transaction = await dbManager.createTransaction();
  try {
    const user = await userRepo.getUserById(userid);
    if (!user) {
      result.message = 'User not found';
      return result;
    }
    await dbManager.getModels().RefreshTokens.destroy({
      where: {
        userId: user.userid,
        refreshToken: hashToken(token),
      },
    });
    await userPinsRepo.deleteUserPins(user.userid);
    await transaction.commit();
    result.success = true;
    result.statusCode = 200;
    result.message = 'Logged out successfully';
    result.id = user.userid;
    result.refresh_location = true;
  } catch (error) {
    await transaction.rollback();
    log.error(
      { error, errorMessage: error.message, stack: error.stack },
      `command::error::${COMMAND_NAME}`
    );
    result.message = error.message || 'Internal server error';
  }
  return result;
}
