import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ParamChecklistIdDto {
  @ApiProperty()
  @IsUUID()
  public checklistId: string;
}
