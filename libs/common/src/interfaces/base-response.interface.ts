export interface IBaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
