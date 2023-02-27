import { Module } from '@nestjs/common';

import { UserRepo } from '@/repository/user.repo';

import { UserService } from './user.service';

@Module({
  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
