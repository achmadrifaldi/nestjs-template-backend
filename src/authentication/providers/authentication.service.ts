import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../../models/users/dto/create-user.dto';
import { User } from '../../models/users/entities/user.entity';
import { UsersService } from '../../models/users/providers/users.service';
import { SALT_OR_ROUND } from '../constants/brcrypt.constant';
import { RegisterEmailDto } from '../dto/register-email.dto';
import { ILogin } from '../interfaces/login.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

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

    return await this.usersService.saveUser(createUserDto);
  }
}
