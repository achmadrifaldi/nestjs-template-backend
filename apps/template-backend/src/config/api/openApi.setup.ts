import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@app/config';
import { INestApplication } from '@nestjs/common';

export const openApiSetup = (app: INestApplication, appConfig: AppConfigService) => {
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
};
