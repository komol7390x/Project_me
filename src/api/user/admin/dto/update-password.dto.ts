import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UpdatePassword{
    // ------------------------------ OLD PASSWORD ------------------------------
    @ApiProperty({
        example: 'Str0ngP@ssword!', description: 'Current password'
    })
    @IsString()
    @IsNotEmpty()
    old_password:string

    // ------------------------------ NEW PASSWORD ------------------------------
     @ApiProperty({
        example: '@Komol7390x', description: 'New password'
    })
    @IsStrongPassword()
    @IsNotEmpty()
    new_password:string
}