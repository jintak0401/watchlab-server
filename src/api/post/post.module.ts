import { Module } from '@nestjs/common';

import { PostController } from '@/api/post/post.controller';
import { S3Service } from '@/api/s3/s3.service';
import { PostRepo } from '@/repository/post.repo';
import { S3Repo } from '@/repository/s3.repo';

import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepo, S3Service, S3Repo],
})
export class PostModule {}
