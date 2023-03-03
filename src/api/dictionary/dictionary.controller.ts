import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { Public } from '@/common/skip-auth.decorator';
import { Language } from 'generated/client';

import { DictionaryService } from './dictionary.service';

@Controller(':lang?/dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  @Public()
  getDictionary(@Param('lang') lang: Language) {
    return this.dictionaryService.getDictionary(lang);
  }

  @Post()
  createDictionary(
    @Param('lang') lang: Language,
    @Body() body: { word: string; description: string },
  ) {
    return this.dictionaryService.createDictionary({ ...body, language: lang });
  }

  @Put(':id')
  updateDictionary(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { word?: string; description?: string },
  ) {
    return this.dictionaryService.updateDictionary(id, body);
  }

  @Delete(':id')
  deleteDictionary(@Param('id', ParseIntPipe) id: number) {
    return this.dictionaryService.deleteDictionary(id);
  }
}
