import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/api/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  genTokensForLogin(id: number, email: string) {
    return {
      accessToken: this.genAccessToken({
        email,
      }),
      refreshToken: this.genRefreshToken({
        id,
      }),
    };
  }

  genAccessToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_AGE'),
    });
  }

  genRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_AGE'),
    });
  }
}
