import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

const SELECT = {
  id: true,
  image: true,
  title: true,
  description: true,
};

@Injectable()
export class GalleryRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getDictionary(language: Language) {
    return this.prisma.gallery.findMany({
      where: { language },
      select: SELECT,
    });
  }

  async createGallery(data: {
    language: Language;
    image: string;
    title: string;
    description: string;
  }) {
    return this.prisma.gallery.create({
      data,
      select: SELECT,
    });
  }

  async updateGallery(
    id: number,
    data: {
      image?: string;
      title?: string;
      description?: string;
    },
  ) {
    return this.prisma.gallery.update({
      where: { id },
      data: {
        image: data.image,
        title: data.title,
        description: data.description,
      },
      select: SELECT,
    });
  }

  async deleteGallery(id: number) {
    return this.prisma.gallery.delete({
      where: { id },
      select: SELECT,
    });
  }
}
