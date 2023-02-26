import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

const TAKE = 10;

const SELECT = {
  slug: true,
  thumbnail: true,
  title: true,
  writerRelation: {
    select: {
      name: true,
      image: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class PostRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getPostList({
    language,
    page = 1,
    limit = TAKE,
    tag,
    writer,
  }: {
    language: Language;
    page?: number;
    limit?: number;
    tag?: string;
    writer?: string;
  }) {
    return this.prisma.post.findMany({
      where: {
        language,
        writer,
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: SELECT,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getPostCount({
    language,
    tag,
    writer,
  }: {
    language: Language;
    tag?: string;
    writer?: string;
  }) {
    return this.prisma.post.count({
      where: {
        language,
        writer,
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
    });
  }

  async getPost(slug_language: { slug: string; language: Language }) {
    return this.prisma.post.findUnique({
      where: { slug_language },
      select: {
        ...SELECT,
        content: true,
      },
    });
  }

  async createPost(data: {
    language: Language;
    writer: string;
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
        ...SELECT,
        content: true,
      },
    });
  }

  async updatePost(
    slug_language: { slug: string; language: Language },
    data: {
      writer?: string;
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
        ...SELECT,
        content: true,
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
