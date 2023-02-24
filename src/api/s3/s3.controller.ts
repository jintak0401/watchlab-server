import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly fileService: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(
    @UploadedFile() image: Express.Multer.File,
    @Body('path') path?: string,
  ) {
    return this.fileService.uploadFile(image, path);
  }
}
