import { processEvent, log } from 'app-tools';

const COMMAND_NAME = 'UpdateAccount';

export default async function updateAccount(event, context, user) {
  const result = { success: false, statusCode: 400 };
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  if (!user) {
    result.message = 'User not found';
    return result;
  }
  const {
    phone,
    username,
    longitude,
    latitude,
    device_token: deviceToken,
  } = queryStringParameters;
  user.set({
    longitude,
    latitude,
    lat: latitude,
    lng: longitude,
    device_token: deviceToken,
    phone,
    username,
  });
  await user.save();
  result.success = true;
  result.statusCode = 200;
  result.message = 'account update succeeded';
  result.id = user.userid;
  result.refresh_location = true;
  return result;
}
