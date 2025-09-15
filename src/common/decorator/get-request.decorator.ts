import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { IToken } from "src/infrastructure/token/token.interface";

// ================================== GET USER ==================================
export const GetRequestUser=createParamDecorator(
    async (data:string,context:ExecutionContext):Promise<IToken>=>{
        try {
            // get request
            const request=context.switchToHttp().getRequest()

            // get user
            const user:IToken=request[data]
            return user
        } catch (error) {
            throw new InternalServerErrorException(`Error on get request user: ${error}`)
        }
    }
)