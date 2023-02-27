import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async genCookiesForLogin(id: number, email: string) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new UnauthorizedException(`It is not our user`);
    }

    return {
      ...this.genAccessTokenCookie({
        email,
      }),
      ...this.genRefreshTokenCookie({
        id,
      }),
    };
  }

  genAccessTokenCookie(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: `${this.config.get('JWT_ACCESS_AGE')}s`,
    });
    const accessOptions = {
      httpOnly: true,
      maxAge: Number(this.config.get('JWT_ACCESS_AGE')) * 1000,
    };
    return {
      accessToken,
      accessOptions,
    };
  }

  genRefreshTokenCookie(payload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.config.get('JWT_REFRESH_AGE')}s`,
    });
    const refreshOptions = {
      httpOnly: true,
      maxAge: Number(this.config.get('JWT_REFRESH_AGE')) * 1000,
    };
    return {
      refreshToken,
      refreshOptions,
    };
  }
}
