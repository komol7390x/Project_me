import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ForgetPassword {
    // --------------------------------------- OLD PASSWORD ---------------------------------------
    @ApiProperty({
        description: 'Avvalgi Password',
        example: '@Strong12PAssword',
    })
    @IsString()
    @IsNotEmpty()
    old_password: string

    // --------------------------------------- NEW PASSWORD ---------------------------------------
    @ApiProperty({
        description: 'Yangi Password',
        example: '@Komol7390x123',
    })
    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    new_password: string
}