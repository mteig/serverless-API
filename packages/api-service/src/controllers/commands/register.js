import {
  processEvent,
  log,
  RepositoryFactory,
  getMD5Hash,
  generateAccessToken,
  generateRefreshToken,
} from 'app-tools';

const COMMAND_NAME = 'Register';

export default async function register(event, context) {
  const result = { success: false, statusCode: 400 };
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const {
    email,
    username,
    longitude,
    latitude,
    device_token: deviceToken,
    phone,
    tag,
    password,
  } = queryStringParameters;

  if (!email) {
    result.message = 'Email is required';
    return result;
  }
  const userRepo = new RepositoryFactory().getUserRepo();
  const user = await userRepo.getUser(email);
  if (user) {
    result.message = 'Email already exists';
    return result;
  }
  const newUser = await userRepo.createUser({
    email,
    username,
    longitude,
    latitude,
    lat: latitude,
    lng: longitude,
    device_token: deviceToken,
    phone,
    tag,
    password: getMD5Hash(password),
  });
  if (!newUser) {
    result.message = 'Failed to create user';
    return result;
  }
  result.success = true;
  result.statusCode = 200;
  result.id = newUser.userid;
  result.refresh_location = true;
  result.accessToken = generateAccessToken(newUser);
  result.refreshToken = await generateRefreshToken(newUser);
  result.message = 'account creation succeeded';
  return result;
}
