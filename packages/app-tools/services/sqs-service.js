import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

class SQSService {
  async sendMessage(message) {
    return sqsClient.send(new SendMessageCommand(message));
  }
}

export default SQSService;
