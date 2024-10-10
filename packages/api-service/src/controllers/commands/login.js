import {
  log,
  processEvent,
  RepositoryFactory,
  getMD5Hash,
  generateAccessToken,
  generateRefreshToken,
} from 'app-tools';

export default async function login(event, context) {
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, 'command::params::login');
  const { email, password } = queryStringParameters;
  const result = { success: false, statusCode: 400 };
  if (!email || !password) {
    result.message = 'Email and password are required';
    return result;
  }
  const userRepo = new RepositoryFactory().getUserRepo();
  const user = await userRepo.getUser(email);
  if (!user) {
    result.message = 'User not found';
    return result;
  }
  const hashedPassword = getMD5Hash(password);
  if (user.password !== hashedPassword) {
    result.message = 'Invalid password';
    return result;
  }
  result.accessToken = generateAccessToken(user);
  result.refreshToken = await generateRefreshToken(user);
  result.id = user.userid;
  result.statusCode = 200;
  result.success = true;
  result.message = 'Login successful';
  return result;
}
