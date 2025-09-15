import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export class SwaggerApi {
  // ======================== SUCCESS ========================
  static ApiSuccessResponse(
    data: object | string | []= {},
    status: number = HttpStatus.OK,
    message: string = 'success',
  ): ApiResponseOptions {
    return {
      status,
      description: message,
      schema: {
        example: {
          statusCode: status,
          message,
          data
        },
      },
    };
  }
  // ======================== ERROR ========================
  static ApiErrorResponse(
    errorMessage: string,
    statusCode: number = 400,
    status: number = HttpStatus.BAD_REQUEST,
  ): ApiResponseOptions {
    return {
      status,
      description: errorMessage,
      schema: {
        example: {
          statusCode,
          error: {
            message: errorMessage,
          },
        },
      },
    };
  }

  // ======================== ID ========================
  static ApiParam(
    name: string='id',
    type: string = 'string',
    example: number = 1,
    description:string='id of admin'
  ) {
    return {
     name,
     type,
     example,
     description
    };
  }
}
