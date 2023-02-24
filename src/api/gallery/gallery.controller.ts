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

import { Language } from 'generated/client';

import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async getGallery(@Query('lang') lang: Language) {
    return this.galleryService.getGallery(lang);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createGallery(
    @Query('lang') lang: Language,
    @Body() body: { title: string; description: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.createGallery(
      {
        language: lang,
        ...body,
      },
      file,
    );
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async updateGallery(
    @Query('id', ParseIntPipe) id: number,
    @Body()
    body: { image?: string; title?: string; description?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.galleryService.updateGallery(id, body, file);
  }

  @Delete()
  async deleteGallery(@Query('id', ParseIntPipe) id: number) {
    return this.galleryService.deleteGallery(id);
  }
}
