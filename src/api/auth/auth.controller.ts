import * as querystring from 'querystring';

import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import { JwtRefreshGuard } from '@/api/auth/jwt-refresh.guard';
import { UserService } from '@/api/user/user.service';
import { Public } from '@/common/skip-auth.decorator';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async genTokens(id, email) {
    const { accessToken, refreshToken } = this.authService.genTokensForLogin(
      id,
      email,
    );
    this.userService.updateRefreshToken(id, refreshToken);
    return { accessToken, refreshToken };
  }

  @Get('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() { user }) {
    return this.genTokens(user.id, user.email);
  }

  @Get('login')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('login/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async login(@Req() { user }, @Res() res) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }
    const data = {
      ...(await this.genTokens(user.id, user.email)),
      name: user.name,
      image: user.image,
      role: user.role,
    };
    const query = querystring.stringify(data);
    const CLIENT_URL = this.config.get('CLIENT_URL');
    res.redirect(`${CLIENT_URL}/auth?${query}`);
  }

  @Get('logout')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req) {
    this.userService.removeRefreshToken(req.user.email);
    return { success: true };
  }
}
