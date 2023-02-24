import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DictionaryModule } from './api/dictionary/dictionary.module';
import { GalleryModule } from './api/gallery/gallery.module';
import { S3Module } from './api/s3/s3.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    S3Module,
    DictionaryModule,
    GalleryModule,
  ],
})
export class AppModule {}
