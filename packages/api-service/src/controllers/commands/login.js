import {
  log,
  processEvent,
  RepositoryFactory,
  getMD5Hash,
  generateAccessToken,
  generateRefreshToken,
} from 'app-tools';

const COMMAND_NAME = 'Login';

export default async function login(event, context) {
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const { email, password } = queryStringParameters;
  const result = { success: false, statusCode: 400 };
  if (!email || !password) {
    result.message = 'bad parameters';
    return result;
  }
  const userRepo = new RepositoryFactory().getUserRepo();
  const user = await userRepo.getUser(email);
  if (!user) {
    result.message = 'email';
    return result;
  }
  const hashedPassword = getMD5Hash(password);
  if (user.password !== hashedPassword) {
    result.message = 'password';
    return result;
  }
  const {
    longitude,
    latitude,
    device_token: deviceToken,
    tag,
  } = queryStringParameters;
  if (longitude && latitude) {
    user.longitude = longitude;
    user.latitude = latitude;
    user.lat = latitude;
    user.lng = longitude;
  }
  if (deviceToken) {
    user.device_token = deviceToken;
  }
  if (tag) {
    user.tag = tag;
  }
  await user.save();

  result.accessToken = generateAccessToken(user);
  result.refreshToken = await generateRefreshToken(user);
  result.id = user.userid;
  result.statusCode = 200;
  result.success = true;
  result.refresh_location = true;
  result.message = 'Login successful';
  return result;
}
