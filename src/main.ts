import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import APIFeatures from './utils/apiFeatures.utils';

async function bootstrap() {
  APIFeatures.configureCloudinary();
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
