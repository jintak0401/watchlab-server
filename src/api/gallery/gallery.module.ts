import { Module } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';
import { GalleryRepo } from '@/repository/gallery.repo';
import { S3Repo } from '@/repository/s3.repo';

import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, GalleryRepo, S3Service, S3Repo],
})
export class GalleryModule {}
