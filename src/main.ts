import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomLoggerService } from 'logger/logger.service';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { AllExceptionsFilter } from './lib/exceptionsFilters';

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(CustomLoggerService));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.isProductionEnvironment,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(configService.get('port'));
}

bootstrap();
