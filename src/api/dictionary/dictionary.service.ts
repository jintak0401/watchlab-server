import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Dictionary, Language } from 'generated/client';

type _Dictionary = Pick<Dictionary, 'id' | 'word' | 'description'>;

const SELECT = {
  id: true,
  word: true,
  description: true,
};

@Injectable()
export class DictionaryService {
  constructor(private prisma: PrismaService) {}

  async getDictionary(language: Language): Promise<_Dictionary[]> {
    return this.prisma.dictionary.findMany({
      where: { language },
      select: SELECT,
    });
  }

  async createDictionary(
    language: Language,
    data: { word: string; description: string },
  ): Promise<_Dictionary> {
    return this.prisma.dictionary.create({
      data: {
        ...data,
        language,
      },
      select: SELECT,
    });
  }

  async updateDictionary(
    id: number,
    data: { word?: string; description?: string },
  ): Promise<_Dictionary> {
    return this.prisma.dictionary.update({
      where: { id },
      data,
      select: SELECT,
    });
  }

  async deleteDictionary(id: number) {
    return this.prisma.dictionary.delete({
      where: { id },
    });
  }
}
