import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @AutoMap()
  @ApiProperty()
  id: string;
  
  @AutoMap()
  @ApiProperty()
  name: string;
  
  @AutoMap()
  @ApiProperty()
  email: string;
}

