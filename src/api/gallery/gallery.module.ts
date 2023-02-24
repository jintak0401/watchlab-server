import { Module } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';

import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, S3Service],
})
export class GalleryModule {}
