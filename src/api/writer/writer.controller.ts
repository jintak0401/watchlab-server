import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { WriterService } from '@/api/writer/writer.service';
import { Public } from '@/common/skip-auth.decorator';
import { WriterType } from 'generated/client';

@Controller('writer')
export class WriterController {
  constructor(private readonly writerService: WriterService) {}

  @Get()
  @Public()
  async getAllWriters() {
    return this.writerService.getAllWriters();
  }

  @Get(':id')
  @Public()
  async getWriter(@Param('id', ParseIntPipe) id: number) {
    return this.writerService.getWriter(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createWriter(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; type: WriterType },
  ) {
    return this.writerService.createWriter(body, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateWriter(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body()
    body: { image?: string; name?: string; type?: WriterType },
  ) {
    return this.writerService.updateWriter(id, body, file);
  }

  @Delete(':id')
  async deleteWriter(@Param('id', ParseIntPipe) id: number) {
    return this.writerService.deleteWriter(id);
  }
}
