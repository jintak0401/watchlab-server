import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const CLIENT_URL = configService.get('CLIENT_URL');

  app.enableCors({
    origin: CLIENT_URL,
    credentials: true,
  });

  await app.listen(PORT || 3000);
}

bootstrap();
