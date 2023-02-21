import { DictionaryService } from '@/dictionary/dictionary.service';
import { UserService } from '@/user/user.service';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Role } from 'generated/client';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dictionaryService: DictionaryService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user')
  async getUser() {
    return this.userService.getUser();
  }

  @Post('user')
  async createUser(@Body() body: { email: string; role?: Role }) {
    return this.userService.createUser(body.email, body.role);
  }

  @Put('user')
  async updateUser(@Body() body: { id: number; email: string; role?: Role }) {
    return this.userService.updateUser(body.id, body.email, body.role);
  }

  @Get('dictionary')
  async getDictionary() {
    return this.dictionaryService.getDictionary();
  }

  @Post('dictionary')
  async createDictionary() {
    return this.dictionaryService.createDictionary('test', 'test');
  }
}
