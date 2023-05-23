import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtConfigModule } from '../config/jwt/config.module';
import { JwtConfigService } from '../config/jwt/config.services';
import { User } from '../models/users/entities/user.entity';
import { PostgresDatabaseProviderModule } from '../providers/database/postgres/provider.module';
import { AuthenticationService } from './authentication.service';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../models/users/users.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtConfigModule,
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
      providers: [
        JwtService,
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: UsersService) =>
                Promise.resolve({ id: '1', ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                email: 'email #1',
                name: 'name #1',
              },
              {
                email: 'email #2',
                name: 'name #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                email: 'email #1',
                name: 'name #1',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
