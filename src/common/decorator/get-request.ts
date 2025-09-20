import { createParamDecorator, ExecutionContext, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { IToken } from "src/infrastructure/token/token-interface"

export const GetUser=createParamDecorator(
    async (data:string,context:ExecutionContext):Promise<IToken>=>{
        try {

            // get request
            const req=context.switchToHttp().getRequest()
            const user:IToken=req[data]
            if(!user){
                throw new NotFoundException('not found user in request')
            }

            // return user
            return user
        } catch (error) {
            throw new InternalServerErrorException(`Error parse user ${error}`)
        }
    }
)