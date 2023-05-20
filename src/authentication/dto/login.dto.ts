import { ApiProperty } from '@nestjs/swagger';
import { ILogin } from '../interfaces/login.interface';

export class LoginDto implements ILogin {
  @ApiProperty()
  access_token: string;
}
