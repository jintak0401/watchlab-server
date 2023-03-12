import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() image: Express.Multer.File,
    @Body('path') path?: string,
  ) {
    return this.s3Service.uploadFile(image, path);
  }

  @Delete(':path')
  deleteFile(@Param('path') path: string) {
    return this.s3Service.deleteFile(path);
  }
}
