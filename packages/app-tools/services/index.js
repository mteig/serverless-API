import S3Service from './s3-service.js';
import SQSService from './sqs-service.js';
import SESService from './ses-service.js';

class ServiceFactory {
  getS3Service(config, request) {
    return new S3Service(config, request);
  }

  getSQSService() {
    return new SQSService();
  }

  getSESService() {
    return new SESService();
  }
}

export default ServiceFactory;
