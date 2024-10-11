import { processEvent, log } from 'app-tools';

const COMMAND_NAME = 'UpdateLocation';

export default async function updateLocation(event, context, user) {
  const result = { success: false, statusCode: 400 };
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const { longitude, latitude } = queryStringParameters;
  if (!user) {
    result.message = 'User not found';
    return result;
  }
  user.set({ longitude, latitude, lat: latitude, lng: longitude });
  await user.save();
  result.success = true;
  result.statusCode = 200;
  result.message = 'Location updated';
  result.id = user.userid;
  result.refresh_location = true;
  return result;
}
