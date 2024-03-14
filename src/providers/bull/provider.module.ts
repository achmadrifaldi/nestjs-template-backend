import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { Module } from '@nestjs/common';
import { RedisConfigModule } from '../../config/redis/config.module';
import { RedisConfigService } from '../../config/redis/config.services';
import { BasicAuthMiddleware } from './basic-auth.middleware';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      useFactory: (redisConfig: RedisConfigService) => ({
        redis: {
          host: redisConfig.redisHost,
          port: Number(redisConfig.redisPort),
        },
      }),
      inject: [RedisConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      middleware: BasicAuthMiddleware,
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
    }),
  ],
})
export class BullProviderModule {}
