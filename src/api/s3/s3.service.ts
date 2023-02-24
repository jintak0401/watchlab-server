import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { S3Repo } from '@/repository/s3.repo';

@Injectable()
export class S3Service {
  constructor(private readonly s3Repo: S3Repo) {}

  async uploadFile(file: Express.Multer.File, path = 'post/') {
    path = path.endsWith('/') ? path : path + '/';
    const ext = file.mimetype.split('/')[1];
    const key = path + uuid() + `.${ext}`;
    return this.s3Repo.uploadFile(key, file.buffer);
  }

  async deleteFile(imagePath: string) {
    const key = imagePath.split('.com/')[1];
    return this.s3Repo.deleteFile(key);
  }
}
