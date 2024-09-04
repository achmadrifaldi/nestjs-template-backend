import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { AppService } from '../../../common/services/app.service';
import { MailService } from '../../../mail/mail.service';

@Injectable()
export class UsersService extends AppService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService
  ) {
    super(userRepository);
  }

  async saveUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await super.save({ body: createUserDto })

    // Send Email
    await this.mailService.sendEmailDelay({ to: user.email, subject: 'Welcome!', payload: { name: user.name } });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await super.findOne({
      where: { email },
    });

    return user;
  }
}
