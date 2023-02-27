import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare, genSalt } from 'bcrypt';

import { UserRepo } from '@/repository/user.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly userRepo: UserRepo,
  ) {}

  async getUser(idOrEmail: string | number, includeRefreshToken = false) {
    return this.userRepo.getUser(idOrEmail, includeRefreshToken);
  }

  async getUserMatchedRefreshToken(
    idOrEmail: string | number,
    refreshToken: string,
  ) {
    const { refreshToken: oldRefreshToken, ...user } =
      await this.userRepo.getUser(idOrEmail, true);
    if (!oldRefreshToken) return null;
    const isMatched = await compare(refreshToken, oldRefreshToken);
    return isMatched ? user : null;
  }

  async updateRefreshToken(idOrEmail: string | number, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, await genSalt());
    return this.userRepo.updateRefreshToken(idOrEmail, hashedRefreshToken);
  }

  async removeRefreshToken(idOrEmail: string | number) {
    return this.userRepo.updateRefreshToken(idOrEmail, null);
  }
}
