import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateWalletDto {
  // ------------------------------ CARD NAME------------------------------
  @ApiPropertyOptional({
    description: 'Karta nomi',
    example: 'Visa Platinum',
  })
  @IsString()
  @IsOptional()
  card_name: string;

  // ------------------------------ CARD NUMBER ------------------------------
  @ApiProperty({
    description: 'Karta raqami',
    example: "1234567890123456",
  })
  @IsString()
  @IsNotEmpty()
  card_number: string;

  // ------------------------------ BALANCE ------------------------------
  @ApiProperty({
    description: 'Hisobdagi balans',
    example: 1000.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  balance: number;

  // ------------------------------ CUSTOMER ID ------------------------------
  @ApiProperty({
    description: 'Mijoz ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  customer_id: number;
   // --------------------------------------- PHONE NUMBER ---------------------------------------
  
    @ApiProperty({
      description: 'Mijozning telefon raqami',
      example: 998935720473,
    })
    @IsNotEmpty()
    @IsNumber({}, { message: 'Telefon raqam raqam bo\'lishi shart' })
    @Min(998000000000, { message: 'Telefon raqam noto\'g\'ri' })
    @Max(998999999999, { message: 'Telefon raqam noto\'g\'ri' })
    phone_number: number;
}
