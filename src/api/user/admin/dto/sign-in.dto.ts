import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignInAdminDto {
  // --------------------------------------- USERNAME ---------------------------------------
  @ApiProperty({
    description: 'Adminning username',
    example: 'admin123%%',
    minLength: 3,
  })
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  username: string;

  // --------------------------------------- PASSSWORD ---------------------------------------
  @ApiProperty({
    description: 'Adminning kuchli paroli',
    example: 'SuperAdmin123%%',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
