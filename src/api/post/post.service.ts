import { Injectable } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';
import { PostRepo } from '@/repository/post.repo';
import { Language } from 'generated/client';

const generateReturn = ({
  tags,
  writerRelation: writer,
  ...rest
}: {
  tags: { tag: { name: string } }[];
  writerRelation?: object;
}) => {
  const _tags = tags.map((tag) => tag.tag.name);
  return { ...rest, writer, tags: _tags };
};

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepo,
    private readonly s3Service: S3Service,
  ) {}

  async getPostList(where: {
    language: Language;
    page?: number;
    limit?: number;
    tag?: string;
    writer?: string;
  }) {
    const list = await this.postRepo.getPostList(where);
    return list.map(generateReturn);
  }
  async getPostCount(where: {
    language: Language;
    tag?: string;
    writer?: string;
  }) {
    return this.postRepo.getPostCount(where);
  }

  async getPost(data: { slug: string; language: Language }) {
    return generateReturn(await this.postRepo.getPost(data));
  }

  async createPost(
    data: {
      writer: string;
      slug: string;
      language: Language;
      title: string;
      content: string;
      tags: string[];
    },
    file: Express.Multer.File,
  ) {
    const thumbnail = await this.s3Service.uploadFile(file, 'thumbnail');
    return generateReturn(
      await this.postRepo.createPost({
        ...data,
        thumbnail,
      }),
    );
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
    return generateReturn(await this.postRepo.updatePost(where, data));
  }

  async deletePost(where: { slug: string; language: Language }) {
    return this.postRepo.deletePost(where);
  }
}
