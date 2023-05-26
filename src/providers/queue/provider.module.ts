import { RedisConfigModule } from '../../config/redis/config.module';
import { RedisConfigService } from '../../config/redis/config.services';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        redis: {
          host: redisConfigService.redisHost,
          port: redisConfigService.redisPort,
        },
      }),
      inject: [RedisConfigService],
    }),
  ],
})
export class BullProviderModule {}
