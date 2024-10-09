import S3Service from './s3-service.js';
import SQSService from './sqs-service.js';

class ServiceFactory {
  getS3Service(config, request) {
    return new S3Service(config, request);
  }

  getSQSService() {
    return new SQSService();
  }
}

export default ServiceFactory;
