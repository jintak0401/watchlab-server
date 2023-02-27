import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';

import { AuthModule } from './api/auth/auth.module';
import { DictionaryModule } from './api/dictionary/dictionary.module';
import { GalleryModule } from './api/gallery/gallery.module';
import { PostModule } from './api/post/post.module';
import { S3Module } from './api/s3/s3.module';
import { TagModule } from './api/tag/tag.module';
import { UserModule } from './api/user/user.module';
import { WriterModule } from './api/writer/writer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),
    PrismaModule,
    S3Module,
    DictionaryModule,
    GalleryModule,
    WriterModule,
    PostModule,
    TagModule,
    AuthModule,
    UserModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
