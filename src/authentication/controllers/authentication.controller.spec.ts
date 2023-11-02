import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtConfigModule } from '../../config/jwt/config.module';
import { UsersService } from '../../models/users/providers/users.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from '../providers/authentication.service';
import { LoginEmailDto } from '../dto/login-email.dto';
import { RegisterEmailDto } from '../dto/register-email.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
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
            create: jest.fn().mockImplementation((user: UsersService) => Promise.resolve({ id: '1', ...user })),
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
              })
            ),
            findOneByEmail: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                email: 'email #1',
                name: 'name #1',
                id,
              })
            ),
            remove: jest.fn(),
          },
        },
      ],
      controllers: [AuthenticationController],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('[POST] /authentication/login', () => {
    it('should return a accessToken', async () => {
      const body = new LoginEmailDto();
      body.email = 'email@test.com';
      body.password = 'secret';

      const request = {
        user: {
          id: '1',
          name: 'user name',
        },
      };

      expect(await controller.login(body, request)).toHaveProperty('accessToken');
    });
  });

  describe('[POST] /authentication/register', () => {
    it('should return error email exists', async () => {
      const body = new RegisterEmailDto();
      body.name = 'user name';
      body.email = 'email@test.com';
      body.password = 'secret';

      try {
        await controller.create(body);
      } catch (error) {
        expect(error.message).toBe('Users with email email@test.com already exists');
      }
    });

    it('should return a user', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockImplementation(() => null);

      const body = new RegisterEmailDto();
      body.name = 'user name';
      body.email = 'email@test.com';
      body.password = 'secret';

      const createUser = await controller.create(body);
      expect(createUser.name).toBe(body.name);
      expect(createUser.email).toBe(body.email);
      expect(userService.create).toBeCalledTimes(1);
    });
  });

  describe('[GET] /authentication/profile', () => {
    it('should return a user', async () => {
      const request = {
        user: {
          id: '1',
          name: 'user name',
        },
      };

      const profile = await controller.getProfile(request);
      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('email');
    });
  });
});
