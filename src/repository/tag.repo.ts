import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

@Injectable()
export class TagRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getPostTags({ language, slug }: { language: Language; slug: string }) {
    return this.prisma.tag.findMany({
      where: {
        posts: {
          some: {
            post: {
              slug,
              language,
            },
          },
        },
      },
      select: {
        name: true,
      },
    });
  }

  async getMatchTags(tag: string) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          contains: tag,
        },
      },
      select: {
        name: true,
      },
    });
  }
}
