import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class DatabasePostgresConfigService {
  constructor(private configService: ConfigService) {}

  get dbName(): string {
    return this.configService.get<string>('databasePostgres.dbName');
  }
  get dbHost(): string {
    return this.configService.get<string>('databasePostgres.dbHost');
  }
  get dbUser(): string {
    return this.configService.get<string>('databasePostgres.dbUser');
  }
  get dbPassword(): string {
    return this.configService.get<string>('databasePostgres.dbPassword');
  }
  get dbPort(): number {
    return this.configService.get<number>('databasePostgres.dbPort');
  }
  get dbSync(): number {
    return this.configService.get<number>('databasePostgres.dbSync');
  }
}
