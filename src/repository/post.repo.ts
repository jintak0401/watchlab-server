import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

const SELECT = {
  slug: true,
  thumbnail: true,
  title: true,
  view: true,
  writerRelation: {
    select: {
      name: true,
      image: true,
    },
  },
};

@Injectable()
export class PostRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getPostList({
    language,
    all,
    page,
    limit,
    tag,
    writer,
  }: {
    language: Language;
    all: boolean;
    page?: number;
    limit?: number;
    tag?: string;
    writer?: string;
  }) {
    const where = { language };
    if (tag) {
      where['tags'] = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }
    if (writer) {
      where['writer'] = writer;
    }
    return this.prisma.post.findMany({
      where,
      skip: all ? undefined : page && (page - 1) * limit,
      take: all ? undefined : limit,
      select: { ...SELECT, createdAt: true },
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

  async getAllPostViews() {
    return this.prisma.post.findMany({
      select: {
        id: true,
        view: true,
      },
    });
  }

  async getPostViewsByPostIds(postIds: number[]) {
    return this.prisma.post.findMany({
      where: {
        id: {
          in: postIds,
        },
      },
      select: {
        id: true,
        view: true,
      },
    });
  }

  async getAllTagsOnPosts(language?: Language) {
    return this.prisma.tagsOnPosts.findMany({
      where: {
        post: {
          language,
        },
      },
    });
  }
  async getRelatedTagsBySlugLang({
    language,
    slug,
  }: {
    language: Language;
    slug: string;
  }) {
    return this.prisma.tagsOnPosts.findMany({
      where: {
        post: {
          slug,
          language,
        },
      },
    });
  }

  async getTagsOnPostsByTagIds(tagIds: number[]) {
    return this.prisma.tagsOnPosts.findMany({
      where: {
        tagId: {
          in: tagIds,
        },
      },
      select: {
        postId: true,
        tagId: true,
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

  async increasePostView(slug_language: { slug: string; language: Language }) {
    return this.prisma.post.update({
      where: {
        slug_language: {
          ...slug_language,
        },
      },
      data: {
        view: {
          increment: 1,
        },
      },
      select: {
        view: true,
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
        slug_language,
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
