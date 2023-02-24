import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DictionaryController } from './api/dictionary/dictionary.controller';
import { DictionaryModule } from './api/dictionary/dictionary.module';
import { DictionaryService } from './api/dictionary/dictionary.service';
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
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class AppModule {}
