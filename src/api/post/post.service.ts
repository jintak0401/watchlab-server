import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { S3Service } from '@/api/s3/s3.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PostRepo } from '@/repository/post.repo';
import { RecommendRepo } from '@/repository/recommend.repo';
import { isEqualSet } from '@/utils/common.utils';
import {
  data2PostAndTagList,
  genReturn,
  getCommonTagCountObj,
  recommendObj2List,
  sortByTagAndView,
  TagCountAndView,
} from '@/utils/post.utils';
import { Language, Recommend } from 'generated/client';

const LIMIT = 10;
const RECOMMEND_POST_LIMIT = 5;

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postRepo: PostRepo,
    private readonly s3Service: S3Service,
    private readonly recommendRepo: RecommendRepo,
  ) {}

  async getPostList(where: {
    language: Language;
    all: boolean;
    page?: number;
    limit?: number;
    tag?: string;
    writer?: string;
  }) {
    if (!where.all) {
      where.limit = where.limit || LIMIT;
      where.page = where.page || 1;
    }
    const list = await this.postRepo.getPostList(where);
    return list.map(genReturn);
  }

  async getPostCount(where: {
    language: Language;
    tag?: string;
    writer?: string;
  }) {
    return this.postRepo.getPostCount(where);
  }

  async getPost({
    isAdmin,
    ...data
  }: {
    slug: string;
    language: Language;
    isAdmin: boolean;
  }) {
    if (!isAdmin) {
      this.postRepo.increasePostView(data);
    }
    const post = await this.postRepo.getPost(data);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return genReturn(post);
  }

  async getRecommendPostList(data: { slug: string; language: Language }) {
    return (await this.recommendRepo.getRecommendings(data)).map(
      (recommend) => recommend.recommending,
    );
  }

  async createPost(
    data: {
      writer: string;
      slug: string;
      language: Language;
      title: string;
      content: string;
      tags: string[];
      thumbnail: string;
    },
    file: Express.Multer.File,
  ) {
    if (file) {
      data.thumbnail = await this.s3Service.uploadFile(file, 'thumbnail');
    }
    // fixme: apply transaction
    const post = await this.postRepo.createPost(data);
    // todo: change to `await this.updateRecommend({ slug: data.slug, language: data.language })` when the number of posts are over threshold
    await this.updateAllRecommend(data.language);
    return genReturn(post);
  }

  async _updateRecommend(posts, tags, postView, oldRecommendList) {
    const newRecommendTable = {};
    postView.forEach(({ id, view }) => {
      (posts[id] ??= { tags: [] })['view'] = view;
    });

    for (const [postId, postTagsAndView] of Object.entries(posts)) {
      const commonTagCountObj = Object.entries(
        getCommonTagCountObj(postTagsAndView as { tags?: number[] }, tags),
      ).reduce((acc, [postId, count]) => {
        acc[postId] = { view: posts[postId].view, count };
        return acc;
      }, {} as TagCountAndView);
      newRecommendTable[postId] = sortByTagAndView(commonTagCountObj)
        .filter((id) => Number(postId) !== id)
        .slice(0, RECOMMEND_POST_LIMIT);
    }
    const deleteRecommenderIds = [];
    const newRecommendList = Object.entries(newRecommendTable)
      .filter(
        ([recommenderId, recommendingIds]) =>
          posts[recommenderId].tags.length > 0 &&
          JSON.stringify(recommendingIds) !==
            JSON.stringify(oldRecommendList[recommenderId]),
      )
      .reduce((acc, [_recommenderId, recommendingIds]) => {
        const recommenderId = Number(_recommenderId);
        deleteRecommenderIds.push(recommenderId);
        (recommendingIds as number[]).forEach((recommendingId, rank) =>
          acc.push({
            recommenderId,
            recommendingId,
            rank,
          }),
        );
        return acc;
      }, [] as Recommend[]);

    if (deleteRecommenderIds.length > 0) {
      await this.prisma.$transaction(async () => {
        await this.recommendRepo.deleteRecommend(deleteRecommenderIds);
        await this.recommendRepo.createRecommend(newRecommendList);
      });
    }

    return newRecommendList;
  }

  async updateRecommend(data: { language: Language; slug: string }) {
    const relations = await this.postRepo.getRelatedTagsBySlugLang(data);
    if (relations.length === 0) {
      return [];
    }
    const targetRecommenderId = relations[0].postId;
    const relatedTags = relations.map((tag) => tag.tagId);
    const { posts, tags } = data2PostAndTagList(
      await this.postRepo.getTagsOnPostsByTagIds(relatedTags),
    );

    const [postView, oldRecommendList] = await Promise.all([
      this.postRepo.getPostViewsByPostIds(Object.keys(posts).map(Number)),
      recommendObj2List(
        await this.recommendRepo.getRecommendsByRecommenderId(
          targetRecommenderId,
        ),
      ),
    ]);

    return this._updateRecommend(
      { [targetRecommenderId]: posts[targetRecommenderId] },
      tags,
      postView,
      oldRecommendList,
    );
  }

  @Cron('0 30 4 * * *')
  async updateAllRecommend(language?: Language) {
    const [tagsOnPosts, postView, oldRecommendList] = await Promise.all([
      this.postRepo.getAllTagsOnPosts(language),
      this.postRepo.getAllPostViews(),
      recommendObj2List(await this.recommendRepo.getAllRecommend()),
    ]);
    const { posts, tags } = data2PostAndTagList(tagsOnPosts);
    return this._updateRecommend(posts, tags, postView, oldRecommendList);
  }

  async updatePost(
    where: { slug: string; language: Language },
    data: {
      writer?: string;
      slug?: string;
      title?: string;
      content?: string;
      tags?: string[];
      thumbnail?: string;
    },
    file?: Express.Multer.File,
  ) {
    if (file) {
      data.thumbnail = await this.s3Service.uploadFile(file, 'thumbnail');
    }
    // fixme: apply transaction
    const post = genReturn(await this.postRepo.updatePost(where, data));
    if (!isEqualSet(new Set(data.tags ?? []), new Set(post.tags))) {
      // todo: change to `await this.updateRecommend(where)` when the number of posts are over threshold
      await this.updateAllRecommend(where.language);
    }
    return post;
  }

  async deletePost(where: { slug: string; language: Language }) {
    return this.postRepo.deletePost(where);
  }
}
