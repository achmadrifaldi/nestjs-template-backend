import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ParamIdDto {
  @ApiProperty()
  @IsUUID()
  public id: string;
}
