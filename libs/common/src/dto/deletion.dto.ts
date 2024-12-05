import { PickType } from '@nestjs/swagger';
import { CreationDto } from './creation.dto';

export class DeletionDto extends PickType(CreationDto, ['user'] as const) {
  id: string;
}
