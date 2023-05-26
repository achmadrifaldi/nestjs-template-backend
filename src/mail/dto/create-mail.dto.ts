import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMailDto {
  @ApiProperty()
  @IsString()
  public to: string;

  @ApiProperty()
  @IsString()
  public subject: string;

  @ApiProperty()
  public data: any;
}
