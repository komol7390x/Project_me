import { ISuccessRes } from './success.interface';

export const successRes = (
  data: object,
  statusCode: number = 200,
): ISuccessRes => {
  return {
    statusCode,
    message: 'success',
    data,
  };
};
