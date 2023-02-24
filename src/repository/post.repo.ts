import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

const TAKE = 10;

@Injectable()
export class PostRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getPostList({
    language,
    slug,
    tag,
  }: {
    language: Language;
    slug?: string;
    tag?: string;
  }) {
    return this.prisma.post.findMany({
      where: {
        language,
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
      skip: slug ? 1 : 0,
      take: TAKE,
      cursor: slug && {
        slug_language: {
          slug,
          language,
        },
      },
      select: {
        id: true,
        slug: true,
        thumbnail: true,
        title: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getPost(slug_language: { slug: string; language: Language }) {
    return this.prisma.post.findUnique({
      where: { slug_language },
      select: {
        id: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        thumbnail: true,
        title: true,
        content: true,
      },
    });
  }

  async createPost(data: {
    language: Language;
    slug: string;
    thumbnail: string;
    title: string;
    content: string;
    tags?: string[];
  }) {
    const { tags, ...rest } = data;
    return this.prisma.post.create({
      data: {
        ...rest,
        tags: {
          create: tags?.map((tag) => ({
            tag: {
              connectOrCreate: { create: { name: tag }, where: { name: tag } },
            },
          })),
        },
      },
      select: {
        id: true,
        slug: true,
        thumbnail: true,
        title: true,
        content: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updatePost(
    slug_language: { slug: string; language: Language },
    data: {
      slug?: string;
      thumbnail?: string;
      title?: string;
      content?: string;
      tags?: string[];
    },
  ) {
    const { tags, ...rest } = data;
    return this.prisma.post.update({
      where: {
        slug_language: {
          ...slug_language,
        },
      },
      data: {
        ...rest,
        tags: {
          deleteMany: {},
          create: tags?.map((tag) => ({
            tag: {
              connectOrCreate: { create: { name: tag }, where: { name: tag } },
            },
          })),
        },
      },
      select: {
        id: true,
        slug: true,
        thumbnail: true,
        title: true,
        content: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async deletePost(slug_language: { slug: string; language: Language }) {
    return this.prisma.post.delete({
      where: { slug_language },
      select: {
        id: true,
        slug: true,
      },
    });
  }
}
