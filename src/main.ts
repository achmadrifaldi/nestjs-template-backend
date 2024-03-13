import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppConfigService } from './config/app/config.services';
import { AppModule } from './app.module';
import { openApiSetup } from './config/api/openApi.setup';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get(AppConfigService);

  /**
   * Global Prefix
   */
  app.setGlobalPrefix('api');

  /**
   * Set Swagger
   */
  openApiSetup(app, appConfig);

  /**
   * Global Serializer
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * Global Validation
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  /**
   * Enable Cors
   */
  app.enableCors();

  await app.listen(appConfig.appPort, appConfig.appHost, () => {
    console.log(`[${appConfig.appName} ${appConfig.appEnv}]`, `//${appConfig.appHost}:${appConfig.appPort}`);
  });
}
bootstrap();
