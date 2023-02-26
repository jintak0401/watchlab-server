import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    return this.galleryService.createGallery(
      {
        ...body,
        language: lang,
      },
      file,
    );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateGallery(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body()
    body: { image?: string; title?: string; description?: string },
  ) {
    return this.galleryService.updateGallery(id, body, file);
  }

  @Delete(':id')
  async deleteGallery(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.deleteGallery(id);
  }
}
