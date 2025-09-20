import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    try {
      // get request
      const request = context.switchToHttp().getRequest();

      // get cookie refresh
      const refreshToken = request.cookies[data];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh Token not found');
      }
      return refreshToken;
    } catch (error) {
      if (error.status == 401) {
        throw new UnauthorizedException('Refresh Token not found');
      }
      throw new InternalServerErrorException(
        `Error verify cooking problem: ${error.message}`,
      );
    }
  },
);
