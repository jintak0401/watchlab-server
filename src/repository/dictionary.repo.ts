import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Language } from 'generated/client';

const SELECT = {
  id: true,
  word: true,
  description: true,
};

@Injectable()
export class DictionaryRepo {
  constructor(private readonly prisma: PrismaService) {}

  async getDictionary(language: Language) {
    return this.prisma.dictionary.findMany({
      where: { language },
      select: SELECT,
    });
  }

  async createDictionary(data: {
    language: Language;
    word: string;
    description: string;
  }) {
    return this.prisma.dictionary.create({
      data,
      select: SELECT,
    });
  }

  async updateDictionary(
    id: number,
    data: {
      word?: string;
      description?: string;
    },
  ) {
    return this.prisma.dictionary.update({
      where: { id },
      data,
      select: SELECT,
    });
  }

  async deleteDictionary(id: number) {
    return this.prisma.dictionary.delete({
      where: { id },
      select: SELECT,
    });
  }
}
