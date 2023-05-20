import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.services';
import { openApiSetup } from './config/api/openApi.setup';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get(AppConfigService);

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
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(appConfig.appPort, appConfig.appHost, () => {
    console.log(
      `[${appConfig.appName} ${appConfig.appEnv}]`,
      `//${appConfig.appHost}:${appConfig.appPort}`,
    );
  });
}
bootstrap();
