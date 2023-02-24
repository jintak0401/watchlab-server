import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Language } from 'generated/client';

import { DictionaryService } from './dictionary.service';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  getDictionary(@Query('lang') lang: Language) {
    return this.dictionaryService.getDictionary(lang);
  }

  @Post()
  createDictionary(
    @Query('lang') lang: Language,
    @Body() body: { word: string; description: string },
  ) {
    return this.dictionaryService.createDictionary(lang, body);
  }

  @Put()
  updateDictionary(
    @Query('id', ParseIntPipe) id: number,
    @Body() body: { word?: string; description?: string },
  ) {
    return this.dictionaryService.updateDictionary(id, body);
  }

  @Delete()
  deleteDictionary(@Query('id', ParseIntPipe) id: number) {
    return this.dictionaryService.deleteDictionary(id);
  }
}
