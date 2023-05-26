import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateMailDto } from '../mail/dto/create-mail.dto';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../models/users/dto/create-user.dto';
import { User } from '../models/users/entities/user.entity';
import { UsersService } from '../models/users/users.service';
import { SALT_OR_ROUND } from './constants/brcrypt.constant';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ILogin } from './interfaces/login.interface';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private usersService: UsersService, private jwtService: JwtService, private mailService: MailService) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(`${pass}`, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(user: any): Promise<ILogin> {
    const payload = { name: user.name, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerEmailDto: RegisterEmailDto): Promise<User> {
    const { email, name, password } = registerEmailDto;

    const emailExists = await this.usersService.findOneByEmail(email);

    if (emailExists) {
      throw new BadRequestException(`Users with email ${email} already exists`);
    }

    /**
     * Hash Password
     */
    const saltOrRounds = SALT_OR_ROUND;
    const passHash = await bcrypt.hash(password, saltOrRounds);

    const createUserDto = new CreateUserDto();
    createUserDto.email = email;
    createUserDto.password = passHash;
    createUserDto.name = name;

    const result = await this.usersService.create(createUserDto);

    try {
      const mailPayload = new CreateMailDto();
      mailPayload.to = email;
      mailPayload.subject = 'Welcome to our app';
      mailPayload.data = {
        name,
      };
      await this.mailService.sendWelcomeMail(mailPayload);
    } catch (err) {
      this.logger.error(err.message);
    }

    return result;
  }
}
