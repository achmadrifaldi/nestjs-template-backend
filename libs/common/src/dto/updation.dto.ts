import { CreationDto } from './creation.dto';

export class UpdationDto<T> extends CreationDto<T> {
  id: string;
}
