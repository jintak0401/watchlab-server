import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtRefreshGuard } from '@/api/auth/jwt-refresh.guard';
import { UserService } from '@/api/user/user.service';
import { Public } from '@/common/skip-auth.decorator';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
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
  async googleAuth(@Req() req) {
    return req;
  }

  @Get('login/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async login(@Req() { user }) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }
    return {
      ...(await this.genTokens(user.id, user.email)),
      name: user.name,
      image: user.image,
    };
  }

  @Get('logout')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req) {
    this.userService.removeRefreshToken(req.user.email);
    return { success: true };
  }
}
