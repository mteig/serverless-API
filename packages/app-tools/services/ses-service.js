import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import moment from 'moment-timezone';
import CONSTANTS from '../utils/constants.js';
import { log } from '../utils/log.js';

class SESService {
  constructor() {
    this.ses = new SESClient({ region: CONSTANTS.REGION });
  }

  formatMessage(message, userRec, contact, timeZone = 'UTC') {
    let formattedMessage = message;
    const currentTime = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss z');

    formattedMessage = formattedMessage.replace('<<datetime>>', currentTime);

    if (userRec) {
      formattedMessage = formattedMessage.replace(
        '<<username>>',
        userRec.username || ''
      );
      formattedMessage = formattedMessage.replace(
        '<<userphone>>',
        userRec.phone || ''
      );
      formattedMessage = formattedMessage.replace(
        '<<latitude>>',
        userRec.latitude || ''
      );
      formattedMessage = formattedMessage.replace(
        '<<longitude>>',
        userRec.longitude || ''
      );
      formattedMessage = formattedMessage.replace(
        '<<userimageref>>',
        userRec.image ? `user_image_${userRec.userid}.png` : 'missinguser.png'
      );
    }

    if (contact) {
      formattedMessage = formattedMessage.replace(
        '<<contactFirst>>',
        contact.firstname || ''
      );
      formattedMessage = formattedMessage.replace(
        '<<contactLast>>',
        contact.lastname || ''
      );
    }

    log.info('Message formatted successfully');
    return formattedMessage;
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async sendEmail(toAddresses, subject, messageHTML) {
    if (
      !toAddresses ||
      toAddresses.length === 0 ||
      toAddresses.some((email) => !this.validateEmail(email))
    ) {
      throw new Error('Invalid or missing email address in ToAddresses.');
    }
    const params = {
      Source: CONSTANTS.EMAIL_FROM_ADDRESS, // Replace with your verified SES email
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: messageHTML,
            Charset: 'utf8',
          },
          Text: {
            Data: messageHTML.replaceAll(/<[^>]*>?/gm, ''), // Convert HTML to plain text
            Charset: 'utf8',
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.ses.send(command);
      log.info({ response }, 'command::response::sendEmail');
      return response;
    } catch (error) {
      log.error({ error }, 'command::error::sendEmail');
      throw error;
    }
  }
}

export default SESService;
