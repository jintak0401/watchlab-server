import {
  Controller,
  Get,
  Req,
  Res,
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

  async setCookiesForLogin(id, email, res) {
    const { accessToken, accessOptions, refreshToken, refreshOptions } =
      await this.authService.genCookiesForLogin(id, email);
    this.userService.updateRefreshToken(id, refreshToken);
    res.cookie('Authentication', accessToken, accessOptions);
    res.cookie('Refresh', refreshToken, refreshOptions);
    return { accessToken, refreshToken };
  }

  @Get('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() { user }, @Res({ passthrough: true }) res) {
    await this.setCookiesForLogin(user.id, user.email, res);
    return { success: true };
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
  async login(@Req() { user }, @Res({ passthrough: true }) res) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }
    await this.setCookiesForLogin(user.id, user.email, res);
    return { name: user.name, image: user.image };
  }

  @Get('logout')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    this.userService.removeRefreshToken(req.user.email);
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
    return { success: true };
  }
}
