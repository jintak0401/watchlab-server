import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from '@/api/post/post.service';
import { NumberPipe } from '@/common/number.pipe';
import { Language } from 'generated/client';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':lang')
  async getPostList(
    @Param('lang') language: Language,
    @Query() query: { tag?: string; writer?: string },
    @Query('page', NumberPipe) page?: number,
    @Query('limit', NumberPipe) limit?: number,
  ) {
    return this.postService.getPostList({
      ...query,
      language,
      page,
      limit,
    });
  }

  @Get(':lang/count')
  async getPostCount(
    @Param('lang') language: Language,
    @Query() query: { tag?: string; writer?: string },
  ) {
    return this.postService.getPostCount({
      ...query,
      language,
    });
  }

  @Get(':lang/:slug')
  async getPost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return this.postService.getPost({ language, slug });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Body()
    body: {
      slug: string;
      language: Language;
      writer: string;
      title: string;
      content: string;
      tags: string[];
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(body, file);
  }

  @Put(':lang/:slug')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      slug?: string;
      writer?: string;
      title?: string;
      content?: string;
      tags?: string[];
      thumbnail?: string;
    },
  ) {
    return this.postService.updatePost({ language, slug }, body, file);
  }

  @Delete(':lang/:slug')
  async deletePost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return this.postService.deletePost({ language, slug });
  }
}