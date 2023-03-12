import { Controller, Get, Param, Query } from '@nestjs/common';

import { TagService } from '@/api/tag/tag.service';
import { BooleanPipe } from '@/common/boolean.pipe';
import { Public } from '@/common/skip-auth.decorator';
import { Language } from 'generated/client';

@Controller(':lang?/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Public()
  async getAllTags(
    @Param('lang') lang: Language,
    @Query('post', BooleanPipe) post?: boolean,
  ) {
    return post
      ? this.tagService.getAllPostTags(lang)
      : this.tagService.getAllTags();
  }

  @Get()
  @Public()
  async getMatchTags(@Query('tag') tag: string) {
    return this.tagService.getMatchTags(tag);
  }

  @Get(':slug')
  @Public()
  async getPostTags(
    @Param('lang') lang: Language,
    @Param('slug') slug: string,
  ) {
    return this.tagService.getPostTags({ language: lang, slug });
  }
}
