import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class EmailWithOtp {
  // --------------------------------------- EMAIL ---------------------------------------

  @ApiProperty({
    description: 'Tizimga kirish uchun tasdidlash uchun Email',
    example: 'www.example@gmail.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  // --------------------------------------- OTP ---------------------------------------

  @ApiProperty({
    description: 'Tasdiqlash uchun otp',
    example: 123456,
  })
  @IsNumber()
  @IsOptional()
  otp?: number;

  // --------------------------------------- NEW PASSWORD ---------------------------------------

  @ApiProperty({
    description: 'Yangi Password',
    example: '@Komol7390x123',
  })
  @IsStrongPassword()
  @IsString()
  @IsOptional()
  new_password?: string;
}
