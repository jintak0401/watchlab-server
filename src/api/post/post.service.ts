import { Injectable } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';
import { PostRepo } from '@/repository/post.repo';
import { Language } from 'generated/client';

const genRetWithConvertTags = ({
  tags,
  ...rest
}: {
  tags: { tag: { name: string } }[];
}) => {
  const _tags = tags.map((tag) => tag.tag.name);
  return { ...rest, tags: _tags };
};

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepo,
    private readonly s3Service: S3Service,
  ) {}

  async getPostList(where: {
    language: Language;
    slug?: string;
    tag?: string;
  }) {
    const list = await this.postRepo.getPostList(where);
    return list.map(genRetWithConvertTags);
  }

  async getPost(data: { slug: string; language: Language }) {
    return genRetWithConvertTags(await this.postRepo.getPost(data));
  }

  async createPost(
    data: {
      slug: string;
      language: Language;
      title: string;
      content: string;
      tags: string[];
    },
    file: Express.Multer.File,
  ) {
    const thumbnail = await this.s3Service.uploadFile(file, 'thumbnail');
    return genRetWithConvertTags(
      await this.postRepo.createPost({
        ...data,
        thumbnail,
      }),
    );
  }

  async updatePost(
    where: { slug: string; language: Language },
    data: {
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
    return genRetWithConvertTags(await this.postRepo.updatePost(where, data));
  }

  async deletePost(where: { slug: string; language: Language }) {
    return this.postRepo.deletePost(where);
  }
}
