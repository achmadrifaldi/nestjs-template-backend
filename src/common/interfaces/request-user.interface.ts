
export interface IRequestUser {
  id: string;
  name: string;
}

export interface IUserAuthInfoRequest extends Request {
  user: IRequestUser;
}
