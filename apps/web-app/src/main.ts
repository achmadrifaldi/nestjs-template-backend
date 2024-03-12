import { NestFactory, Reflector } from '@nestjs/core';
import { WebAppModule } from './web-app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from '@app/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(WebAppModule);

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get(AppConfigService);

  /**
   * Global Prefix
   */
  app.setGlobalPrefix('api');

  /**
   * Swagger Config
   * https://docs.nestjs.com/openapi/introduction
   */
  const docConfig = new DocumentBuilder()
    .setTitle(appConfig.appName)
    .setDescription('List of API(s)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('docs', app, document);

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
