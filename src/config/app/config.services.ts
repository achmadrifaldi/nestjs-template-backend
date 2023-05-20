import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appName(): string {
    return this.configService.get<string>('app.appName');
  }
  get appHost(): string {
    return this.configService.get<string>('app.appHost');
  }
  get appPort(): string {
    return this.configService.get<string>('app.appPort');
  }
  get appEnv(): string {
    return this.configService.get<string>('app.appEnv');
  }
}
