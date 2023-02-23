import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('AWS_BUCKET_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, path = 'post/') {
    path = path.endsWith('/') ? path : path + '/';

    try {
      const bucket = this.configService.get('AWS_BUCKET_NAME');
      const ext = file.mimetype.split('/')[1];
      const key = path + uuid() + `.${ext}`;
      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
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
}
