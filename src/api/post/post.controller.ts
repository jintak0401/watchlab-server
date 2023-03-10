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
import { BooleanPipe } from '@/common/boolean.pipe';
import { NumberPipe } from '@/common/number.pipe';
import { Public } from '@/common/skip-auth.decorator';
import { Language } from 'generated/client';

@Controller(':lang?/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('recommend/:slug')
  @Public()
  async getRecommendPostList(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return this.postService.getRecommendPostList({ language, slug });
  }

  @Get(':slug')
  @Public()
  async getPost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
    @Query('admin', BooleanPipe) isAdmin: boolean,
  ) {
    return this.postService.getPost({
      language,
      slug,
      isAdmin,
    });
  }

  @Get()
  @Public()
  async getPostList(
    @Param('lang') language: Language,
    @Query() query: { tag?: string; writer?: string },
    @Query('all', BooleanPipe) all?: boolean,
    @Query('page', NumberPipe) page?: number,
    @Query('limit', NumberPipe) limit?: number,
  ) {
    return this.postService.getPostList({
      ...query,
      all,
      language,
      page,
      limit,
    });
  }

  @Get('count')
  @Public()
  async getPostCount(
    @Param('lang') language: Language,
    @Query() query: { tag?: string; writer?: string },
  ) {
    return this.postService.getPostCount({
      ...query,
      language,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Param('lang') language: Language,
    @Body()
    {
      tags,
      ...body
    }: {
      slug: string;
      writer: string;
      title: string;
      content: string;
      tags: string | string[];
      thumbnail: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(
      {
        ...body,
        language,
        tags: typeof tags === 'string' ? [tags] : [...new Set(tags)],
      },
      file,
    );
  }

  @Put('recommend/:slug?')
  async updateRecommend(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return language && slug
      ? this.postService.updateRecommend({ language, slug })
      : this.postService.updateAllRecommend(language);
  }

  @Put(':slug')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    {
      tags,
      ...body
    }: {
      slug?: string;
      writer?: string;
      title?: string;
      content?: string;
      tags?: string | string[];
      thumbnail?: string;
    },
  ) {
    return this.postService.updatePost(
      { language, slug },
      { ...body, tags: typeof tags === 'string' ? [tags] : [...new Set(tags)] },
      file,
    );
  }

  @Delete(':slug')
  async deletePost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return this.postService.deletePost({ language, slug });
  }
}
