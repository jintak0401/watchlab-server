import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Repo {
  s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('AWS_BUCKET_REGION'),
    });
  }

  async uploadFile(key: string, buffer: Buffer) {
    try {
      const bucket = this.configService.get('AWS_BUCKET_NAME');
      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
      });
      const [_, region] = await Promise.all([
        this.s3Client.send(putCommand),
        this.s3Client.config.region(),
      ]);

      return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteFile(key: string) {
    try {
      const bucket = this.configService.get('AWS_BUCKET_NAME');
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      await this.s3Client.send(deleteCommand);
    } catch (e) {
      throw new Error(e);
    }
  }
}
