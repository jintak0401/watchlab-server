import { Controller, Get, Param, Query } from '@nestjs/common';

import { TagService } from '@/api/tag/tag.service';
import { Public } from '@/common/skip-auth.decorator';
import { Language } from 'generated/client';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Public()
  async getMatchTags(@Query('tag') tag: string) {
    return this.tagService.getMatchTags(tag);
  }

  @Get(':language/:slug')
  @Public()
  async getPostTags(@Param() params: { language: Language; slug: string }) {
    return this.tagService.getPostTags(params);
  }
}
