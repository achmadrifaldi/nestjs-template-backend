import * as bcrypt from 'bcrypt';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtConfigModule } from '../config/jwt/config.module';
import { UsersService } from '../models/users/users.service';
import { AuthenticationService } from './authentication.service';
import { RegisterEmailDto } from './dto/register-email.dto';
import { MailService } from '../mail/mail.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userService: UsersService;
  let mailService: MailService;

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
              })
            ),
            create: jest.fn().mockImplementation((user: UsersService) => Promise.resolve({ id: '1', ...user })),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendWelcomeMail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
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

  describe('login', () => {
    it('should return a accessToken', async () => {
      const request = {
        user: {
          id: '1',
          name: 'user name',
        },
      };

      expect(await service.login(request.user)).toHaveProperty('accessToken');
    });
  });

  describe('register', () => {
    it('should return error email exists', async () => {
      const body = new RegisterEmailDto();
      body.name = 'user name';
      body.email = 'email@test.com';
      body.password = 'secret';

      try {
        await service.register(body);
      } catch (error) {
        expect(error.message).toBe('Users with email email@test.com already exists');
      }
    });

    it('should return a user', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockImplementation(() => null);
      jest.spyOn(mailService, 'sendWelcomeMail').mockResolvedValue(true);

      const body = new RegisterEmailDto();
      body.name = 'user name';
      body.email = 'email@test.com';
      body.password = 'secret';

      const createUser = await service.register(body);
      expect(createUser.name).toBe(body.name);
      expect(createUser.email).toBe(body.email);
      expect(userService.create).toBeCalledTimes(1);
      expect(mailService.sendWelcomeMail).toBeCalledTimes(1);
    });
  });
});
