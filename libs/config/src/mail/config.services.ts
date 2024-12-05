import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MailConfigService {
  constructor(private configService: ConfigService) {}

  get mailFrom(): string {
    return this.configService.get<string>('mail.mailFrom');
  }
  get mailHost(): string {
    return this.configService.get<string>('mail.mailHost');
  }
  get mailPort(): number {
    return this.configService.get<number>('mail.mailPort');
  }
  get mailUsername(): string {
    return this.configService.get<string>('mail.mailUsername');
  }
  get mailPassword(): string {
    return this.configService.get<string>('mail.mailPassword');
  }
}
