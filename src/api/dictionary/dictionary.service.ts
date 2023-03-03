import { Injectable } from '@nestjs/common';

import { DictionaryRepo } from '@/repository/dictionary.repo';
import { Dictionary, Language } from 'generated/client';

type _Dictionary = Omit<Dictionary, 'language'>;

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepo: DictionaryRepo) {}

  async getDictionary(language: Language): Promise<_Dictionary[]> {
    return this.dictionaryRepo.getDictionary(language);
  }

  async createDictionary(data: {
    language: Language;
    word: string;
    description: string;
  }): Promise<_Dictionary> {
    return this.dictionaryRepo.createDictionary(data);
  }

  async updateDictionary(
    id: number,
    data: { word?: string; description?: string },
  ): Promise<_Dictionary> {
    return this.dictionaryRepo.updateDictionary(id, data);
  }

  async deleteDictionary(id: number): Promise<_Dictionary> {
    return this.dictionaryRepo.deleteDictionary(id);
  }
}
