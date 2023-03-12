import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

@Injectable()
export class TagRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTags() {
    return this.prisma.tag.findMany({
      select: {
        name: true,
      },
    });
  }

  async getAllPostTags(language: Language) {
    return this.prisma.tag.findMany({
      where: {
        posts: {
          some: {
            post: {
              language,
            },
          },
        },
      },
      select: {
        name: true,
        posts: {
          select: {
            post: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });
  }

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
