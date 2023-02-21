import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Role, User } from 'generated/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(email: string, role?: Role): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        role,
      },
    });
  }

  async updateUser(
    id: string | number,
    email: string,
    role?: Role,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        role,
      },
    });
  }
}
