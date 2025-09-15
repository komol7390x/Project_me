import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInCustomer {
    // --------------------------------------- EMAIl ---------------------------------------
    @ApiProperty({
        description: 'Tizimga kirish uchu Email',
        example: 'www.komol8689@gmail.com',
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    // --------------------------------------- PASSWORD ---------------------------------------
    @ApiProperty({
        description: 'Tizimga kirish uchu Password',
        example: '@Komol7390x',
    })
    @IsString()
    @IsNotEmpty()
    password: string
}