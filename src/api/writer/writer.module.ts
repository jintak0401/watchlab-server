import { Module } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';
import { S3Repo } from '@/repository/s3.repo';
import { WriterRepo } from '@/repository/writer.repo';

import { WriterController } from './writer.controller';
import { WriterService } from './writer.service';

@Module({
  controllers: [WriterController],
  providers: [WriterService, WriterRepo, S3Service, S3Repo],
})
export class WriterModule {}
