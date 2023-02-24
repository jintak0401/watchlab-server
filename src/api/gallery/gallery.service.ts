import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Gallery, Language } from 'generated/client';

type _Gallery = Omit<Gallery, 'language'>;

const SELECT = {
  id: true,
  image: true,
  title: true,
  description: true,
};

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async getGallery(language: Language): Promise<_Gallery[]> {
    return this.prisma.gallery.findMany({
      where: { language },
      select: SELECT,
    });
  }

  async createGallery(
    language: Language,
    data: { image: string; title: string; description: string },
  ) {
    return this.prisma.gallery.create({
      data: {
        ...data,
        language,
      },
      select: SELECT,
    });
  }

  async updateGallery(
    id: number,
    data: { image?: string; title?: string; description?: string },
  ) {
    return this.prisma.gallery.update({
      where: { id },
      data,
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
