import { Injectable } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';
import { WriterRepo } from '@/repository/writer.repo';
import { Writer, WriterType } from 'generated/client';

type _Writer = Pick<Writer, 'id' | 'name' | 'image' | 'type'>;

@Injectable()
export class WriterService {
  constructor(
    private readonly writerRepo: WriterRepo,
    private readonly s3Service: S3Service,
  ) {}

  async getAllWriters(): Promise<_Writer[]> {
    return this.writerRepo.getAllWriters();
  }

  async getWriter(id: number): Promise<_Writer> {
    return this.writerRepo.getWriter(id);
  }

  async createWriter(
    data: {
      name: string;
      type: WriterType;
    },
    file: Express.Multer.File,
  ): Promise<_Writer> {
    const image = await this.s3Service.uploadFile(file, 'writer');
    return this.writerRepo.createWriter({ ...data, image });
  }

  async updateWriter(
    id: number,
    data: { name?: string; image?: string; type?: WriterType },
    file?: Express.Multer.File,
  ): Promise<_Writer> {
    if (file) {
      data.image = await this.s3Service.uploadFile(file, 'writer');
    }
    return this.writerRepo.updateWriter(id, data);
  }

  async deleteWriter(id: number): Promise<_Writer> {
    return this.writerRepo.deleteWriter(id);
  }
}
