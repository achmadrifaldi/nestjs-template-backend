import { JwtConfigModule } from '../../config/src/jwt/config.module';
import { JwtConfigService } from '../../config/src/jwt/config.services';
import { UserModule } from '../../domain/src/user/user.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationService } from './services/authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtConfigModule,
    UserModule,
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
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  exports: [PassportModule, JwtModule, AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
