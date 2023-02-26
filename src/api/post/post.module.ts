import { Module } from '@nestjs/common';

import { PostController } from '@/api/post/post.controller';
import { S3Service } from '@/api/s3/s3.service';
import { PostRepo } from '@/repository/post.repo';
import { RecommendRepo } from '@/repository/recommend.repo';
import { S3Repo } from '@/repository/s3.repo';

import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepo, S3Service, S3Repo, RecommendRepo],
})
export class PostModule {}
