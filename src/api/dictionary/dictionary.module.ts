import { Module } from '@nestjs/common';

import { DictionaryRepo } from '@/repository/dictionary.repo';

import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService, DictionaryRepo],
})
export class DictionaryModule {}
