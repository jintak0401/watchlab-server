import { Injectable } from '@nestjs/common';

import { S3Service } from '@/api/s3/s3.service';
import { GalleryRepo } from '@/repository/gallery.repo';
import { Gallery, Language } from 'generated/client';

type _Gallery = Omit<Gallery, 'language'>;

@Injectable()
export class GalleryService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly galleryRepo: GalleryRepo,
  ) {}

  async getGallery(language: Language): Promise<_Gallery[]> {
    return this.galleryRepo.getDictionary(language);
  }

  async createGallery(
    data: {
      language: Language;
      title: string;
      description: string;
    },
    file: Express.Multer.File,
  ): Promise<_Gallery> {
    const image = await this.s3Service.uploadFile(file, 'gallery');
    return this.galleryRepo.createGallery({ ...data, image });
  }

  async updateGallery(
    id: number,
    data: { image?: string; title?: string; description?: string },
    file?: Express.Multer.File,
  ): Promise<_Gallery> {
    if (file) {
      data.image = await this.s3Service.uploadFile(file, 'gallery');
    }
    return this.galleryRepo.updateGallery(id, data);
  }

  async deleteGallery(id: number): Promise<_Gallery> {
    return this.galleryRepo.deleteGallery(id);
  }
}
