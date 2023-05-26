import { JwtConfigModule } from '../config/jwt/config.module';
import { JwtConfigService } from '../config/jwt/config.services';
import { UsersModule } from '../models/users/users.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: async (configService: JwtConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExp,
          issuer: configService.jwtIssuer,
        },
      }),
      inject: [JwtConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
