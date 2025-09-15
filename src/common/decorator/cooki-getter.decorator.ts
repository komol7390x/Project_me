import { createParamDecorator, ExecutionContext, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

// ================================== DECOREATOR REFRESH TOKEN ==================================
export const  CookieGetter=createParamDecorator(
    async (data:string,context:ExecutionContext):Promise<string>=>{
        try {
            // get request
            const request=context.switchToHttp().getRequest()

            // get cookies
            const refreshToken=request.cookies[data]

            // check token
            if(!refreshToken){
                throw new UnauthorizedException('Refresh Token not found')
            }
            
            return refreshToken
        } catch (error) {
            throw new InternalServerErrorException(
                `Error on reading cookie: ${error}`
            )
        }
    }
)