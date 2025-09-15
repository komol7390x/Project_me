import {FindManyOptions} from 'typeorm'

export interface ISuccessRes {
  statusCode: number;
  message: string;
  data: object;
}

export interface IResponsePagination extends ISuccessRes {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  from: number;
  to: number;
}

export interface IFindOption<T> extends FindManyOptions<T>{}