import {
  log,
  processEvent,
  RepositoryFactory,
  getMD5Hash,
  generateRandomPassword,
  ServiceFactory,
} from 'app-tools';

const COMMAND_NAME = 'ForgotPassword';

export default async function forgotPassword(event, context) {
  const { queryStringParameters } = processEvent(event);
  log.info({ queryStringParameters }, `command::params::${COMMAND_NAME}`);
  const { email, language } = queryStringParameters;
  const result = { success: false, statusCode: 400 };
  if (!email) {
    result.message = 'Email is required';
    return result;
  }
  const userRepo = new RepositoryFactory().getUserRepo();
  const user = await userRepo.getUser(email);
  if (!user) {
    result.message = 'User not found';
    return result;
  }
  const randomPassword = generateRandomPassword();
  const hashedPassword = getMD5Hash(randomPassword);
  user.password = hashedPassword;
  const sesService = new ServiceFactory().getSESService();
  const messageRepo = new RepositoryFactory().getMessageRepo();
  const message = await messageRepo.findMessage({
    language_code: language || 'en',
    message_code: 'forgot_password',
  });
  if (!message) {
    result.message = 'Template not found';
    return result;
  }
  const emailContent = message.message.replace('<<password>>', randomPassword);
  const formatted = sesService.formatMessage(emailContent, undefined, user);
  const emailResponse = await sesService.sendEmail(
    [user.email],
    message.subject,
    formatted
  );
  if (emailResponse && emailResponse.MessageId) {
    result.success = true;
    result.statusCode = 200;
    result.message = 'Email sent';
    result.id = user.userid;
    result.refresh_location = true;
    await user.save();
  }
  return result;
}
