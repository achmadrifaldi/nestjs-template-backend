import { JwtConfigModule } from './config/jwt/config.module';
import { JwtConfigService } from './config/jwt/config.services';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../../features/src/user/user.module';

@Module({
  imports: [
    JwtConfigModule,
    PassportModule,
    UserModule,
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
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
