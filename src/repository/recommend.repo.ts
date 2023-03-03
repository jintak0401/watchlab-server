import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language, Recommend } from 'generated/client';

@Injectable()
export class RecommendRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRecommend() {
    return this.prisma.recommend.findMany();
  }

  async getRecommendsByRecommenderId(recommenderId: number) {
    return this.prisma.recommend.findMany({
      where: {
        recommenderId,
      },
    });
  }

  async getRecommendings(data: { slug: string; language: Language }) {
    return this.prisma.recommend.findMany({
      where: {
        recommending: {
          slug: data.slug,
          language: data.language,
        },
      },
      select: {
        recommending: {
          select: {
            slug: true,
            title: true,
            thumbnail: true,
            view: true,
          },
        },
      },
    });
  }

  async deleteRecommend(recommenderIds: number[]) {
    return this.prisma.recommend.deleteMany({
      where: {
        recommenderId: {
          in: recommenderIds,
        },
      },
    });
  }

  async createRecommend(data: Recommend[]) {
    return this.prisma.recommend.createMany({
      data,
    });
  }
}
