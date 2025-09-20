import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SignInAdminDto {
  // --------------------------------------- USERNAME ---------------------------------------
  @ApiProperty({
    description: 'Adminning username',
    example: 'komol1234',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  // --------------------------------------- PASSSWORD ---------------------------------------
  @ApiProperty({
    description: 'Adminning kuchli paroli',
    example: '@Komol7390x',
  })
  @IsNotEmpty()
  password: string;
}