import { Module } from '@nestjs/common';

import { S3Repo } from '@/repository/s3.repo';

import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [S3Service, S3Repo],
})
export class S3Module {}
