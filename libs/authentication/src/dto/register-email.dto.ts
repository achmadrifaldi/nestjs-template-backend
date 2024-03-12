import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;
}
