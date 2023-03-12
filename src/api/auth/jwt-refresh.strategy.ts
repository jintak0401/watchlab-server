import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '@/api/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: { id?: number; email?: string }) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const user = await this.userService.getUserMatchedRefreshToken(
      payload.id ?? payload.email,
      refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException('Need login');
    }
    return { email: user.email, id: user.id, role: user.role };
  }
}
