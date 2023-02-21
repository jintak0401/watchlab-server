import { DictionaryService } from '@/dictionary/dictionary.service';
import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dictionaryService: DictionaryService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('dictionary')
  async createDictionary(tmp) {
    console.log(tmp);
    return this.dictionaryService.createDictionary('test', 'test');
  }
}
