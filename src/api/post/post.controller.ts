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
import { Public } from '@/common/skip-auth.decorator';
import { Language } from 'generated/client';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('recommend/:lang/:slug')
  @Public()
  async getRecommendPostList(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return this.postService.getRecommendPostList({ language, slug });
  }

  @Get(':lang')
  @Public()
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

  @Get(':lang/:slug')
  @Public()
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
    {
      tags,
      ...body
    }: {
      slug: string;
      language: Language;
      writer: string;
      title: string;
      content: string;
      tags: string | string[];
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(
      { ...body, tags: typeof tags === 'string' ? [tags] : [...new Set(tags)] },
      file,
    );
  }

  @Put('recommend/:lang?/:slug?')
  async updateRecommend(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return language && slug
      ? this.postService.updateRecommend({ language, slug })
      : this.postService.updateAllRecommend(language);
  }

  @Put(':lang/:slug')
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

  @Delete(':lang/:slug')
  async deletePost(
    @Param('lang') language: Language,
    @Param('slug') slug: string,
  ) {
    return this.postService.deletePost({ language, slug });
  }
}
