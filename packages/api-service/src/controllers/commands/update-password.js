import { log, processEvent, getMD5Hash } from 'app-tools';

const COMMAND_NAME = 'UpdatePassword';

export default async function updatePassword(event, context, user) {
  const result = { success: false, statusCode: 400 };
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const { oldpassword, newpassword } = queryStringParameters;
  if (!oldpassword || !newpassword) {
    result.message = 'bad request';
    return result;
  }
  if (user.password !== getMD5Hash(oldpassword)) {
    result.message = 'bad password';
    return result;
  }
  user.set({ password: getMD5Hash(newpassword) });
  await user.save();
  result.success = true;
  result.id = user.userid;
  result.refresh_location = true;
  result.message = 'password updated';
  result.statusCode = 200;
  return result;
}
