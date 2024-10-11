import { processEvent, log, RepositoryFactory, getMD5Hash } from 'app-tools';

const COMMAND_NAME = 'CreatePin';

export default async function createPin(event, context, user) {
  const result = { success: false, statusCode: 400 };
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  if (!user) {
    result.message = 'User not found';
    return result;
  }
  const { pincode } = queryStringParameters;
  const userPinRepo = new RepositoryFactory().getUserPinsRepo();
  const userPin = await userPinRepo.getUserPin(user.userid);
  if (userPin) {
    userPin.pin = getMD5Hash(pincode);
    await userPin.save();
  } else {
    await userPinRepo.createUserPin(user.userid, getMD5Hash(pincode));
  }
  result.success = true;
  result.statusCode = 200;
  result.message = 'Pin update succeeded';
  result.id = user.userid;
  result.refresh_location = true;
  return result;
}
