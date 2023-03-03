import { Injectable } from '@nestjs/common';

import { TagRepo } from '@/repository/tag.repo';
import { flatTags } from '@/utils/tag.utils';
import { Language } from 'generated/client';

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepo) {}

  async getPostTags(where: { language: Language; slug: string }) {
    return flatTags(await this.tagRepo.getPostTags(where));
  }

  async getMatchTags(tag: string) {
    return flatTags(await this.tagRepo.getMatchTags(tag));
  }
}
