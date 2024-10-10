import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import mime from 'mime';
import path from 'node:path';
import fs from 'node:fs';
import CONSTANTS from '../utils/constants.js';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

class S3Service {
  constructor(config, request) {
    this.config = config;
    this.request = request;
  }

  async getUploadReportPreSignedUrl(file, userId) {
    const meta = {
      name: file,
      path: `users/reports/${userId}/${Date.now()}-${file}`,
      mime_type: mime.getType(file),
    };
    meta.upload_url = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: CONSTANTS.ASSETS_BUCKET_NAME,
        Key: meta.path,
        ContentType: mime.getType(file),
      })
    );
    return meta;
  }

  async getDownloadPreSignedUrl(key) {
    return getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: CONSTANTS.ASSETS_BUCKET_NAME,
        Key: key,
      })
    );
  }

  async downloadFile(
    attachment,
    Bucket = CONSTANTS.ASSETS_BUCKET_NAME,
    tmpDir = '/tmp'
  ) {
    const filePath = path.join(tmpDir, attachment.name);

    const getObjectParams = { Bucket, Key: attachment.path };

    const command = new GetObjectCommand(getObjectParams);
    const response = await s3Client.send(command);

    // Write stream to /tmp directory
    const fileStream = fs.createWriteStream(filePath);
    return new Promise((resolve, reject) => {
      response.Body.pipe(fileStream)
        .on('error', reject)
        .on('close', () => resolve(filePath));
    });
  }

  async uploadFile(Body, Key, Bucket = CONSTANTS.ASSETS_BUCKET_NAME) {
    const putObjectParams = {
      Bucket,
      Key,
      Body,
      ContentType: 'application/json',
    };
    const command = new PutObjectCommand(putObjectParams);
    return s3Client.send(command);
  }
}

export default S3Service;
