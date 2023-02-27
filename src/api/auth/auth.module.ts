import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '@/api/auth/auth.service';
import { GoogleStrategy } from '@/api/auth/google.strategy';
import { JwtRefreshStrategy } from '@/api/auth/jwt-refresh.strategy';
import { JwtStrategy } from '@/api/auth/jwt.strategy';
import { UserModule } from '@/api/user/user.module';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: `${config.get('JWT_ACCESS_AGE')}s` },
      }),
    }),
    UserModule,
  ],
  providers: [GoogleStrategy, AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
