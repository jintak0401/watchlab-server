import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { WriterType } from 'generated/client';

const SELECT = {
  id: true,
  name: true,
  image: true,
  type: true,
};

@Injectable()
export class WriterRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getAllWriters() {
    return this.prisma.writer.findMany({
      where: { deleted: false },
      select: SELECT,
    });
  }

  async getWriter(id: number) {
    return this.prisma.writer.findUnique({
      where: { id },
      select: SELECT,
    });
  }

  async createWriter(data: { name: string; image: string; type: WriterType }) {
    return this.prisma.writer.create({
      data,
      select: SELECT,
    });
  }

  async updateWriter(
    id: number,
    data: { name?: string; image?: string; type?: WriterType },
  ) {
    return this.prisma.writer.update({
      where: { id },
      data,
      select: SELECT,
    });
  }

  async deleteWriter(id: number) {
    return this.prisma.writer.update({
      where: { id },
      data: { deleted: true },
      select: SELECT,
    });
  }
}
