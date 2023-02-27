import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  genWhere(idOrEmail: string | number) {
    return {
      [typeof idOrEmail === 'string' ? 'email' : 'id']: idOrEmail,
    };
  }

  async getUser(idOrEmail: string | number, refreshToken: boolean) {
    const where = this.genWhere(idOrEmail);
    return this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        refreshToken,
      },
    });
  }

  async updateRefreshToken(
    idOrEmail: string | number,
    refreshToken: string | null,
  ) {
    const where = this.genWhere(idOrEmail);
    return this.prisma.user.update({
      where,
      data: { refreshToken },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}
