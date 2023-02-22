import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { Dictionary } from 'generated/client';

@Injectable()
export class DictionaryService {
  constructor(private prisma: PrismaService) {}

  async getDictionary(): Promise<Dictionary[]> {
    return this.prisma.dictionary.findMany();
  }

  async createDictionary(
    word: string,
    description: string,
  ): Promise<Dictionary> {
    return this.prisma.dictionary.create({
      data: {
        word,
        description,
      },
    });
  }
}
