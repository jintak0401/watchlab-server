import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { S3Service } from '@/api/s3/s3.service';
import { Language } from 'generated/client';

import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async getGallery(@Query('lang') lang: Language) {
    return this.galleryService.getGallery(lang);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createGallery(
    @Query('lang') lang: Language,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    const image = await this.s3Service.uploadFile(file, 'gallery');
    return this.galleryService.createGallery(lang, {
      ...body,
      image,
    });
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async updateGallery(
    @Query('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { image?: string; title?: string; description?: string },
  ) {
    if (file) {
      body.image = await this.s3Service.uploadFile(file, 'gallery');
    }
    return this.galleryService.updateGallery(id, body);
  }

  @Delete()
  async deleteGallery(@Query('id', ParseIntPipe) id: number) {
    return this.galleryService.deleteGallery(id);
  }
}
