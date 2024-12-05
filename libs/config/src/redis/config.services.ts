import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  get redisHost(): string {
    return this.configService.get<string>('redis.redisHost');
  }
  get redisPort(): string {
    return this.configService.get<string>('redis.redisPort');
  }
  get redisUsername(): string {
    return this.configService.get<string>('redis.redisUsername');
  }
  get redisPassword(): string {
    return this.configService.get<string>('redis.redisPassword');
  }
}
