import { IRequestUser } from '../interfaces/request-user.interface';

export class CreationDto<T> {
  body: T;
  user?: IRequestUser;
}
