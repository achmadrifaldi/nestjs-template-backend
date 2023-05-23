import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtConfigModule } from '../config/jwt/config.module';
import { JwtConfigService } from '../config/jwt/config.services';
import { UsersService } from '../models/users/users.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

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
      controllers: [AuthenticationController],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
