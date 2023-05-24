import * as bcrypt from 'bcrypt';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtConfigModule } from '../config/jwt/config.module';
import { UsersService } from '../models/users/users.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtConfigModule,
        PassportModule,
        JwtModule.register({
          secretOrPrivateKey: 'secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                email: 'email #1',
                name: 'name #1',
                id,
              }),
            ),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null when user not found', async () => {
      const email = 'email@test.com';
      const password = 'secret';

      jest.spyOn(userService, 'findOneByEmail').mockImplementation(() => null);

      expect(await service.validateUser(email, password)).toBe(null);
    });

    it('should return null when password invalid', async () => {
      const email = 'email@test.com';
      const password = 'secret';

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      expect(await service.validateUser(email, password)).toBe(null);
    });

    it('should return a user', async () => {
      const email = 'email@test.com';
      const password = 'secret';

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      expect(await service.validateUser(email, password)).toHaveProperty('id');
    });
  });
});
