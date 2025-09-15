import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class BalanceDto {
  // --------------------------------------- CARD ID (CARD NUMBER) ---------------------------------------
  @ApiProperty({
    description: 'Karta ID raqami',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  card_id: number;

  // --------------------------------------- BALANCE ---------------------------------------
  @ApiProperty({
    description: "Balans miqdori (so'mda)",
    example: 150000,
  })
  @IsNumber({}, { message: "Balans raqam bo'lishi shart" })
  @Min(0, { message: "Balans manfiy bo'lishi mumkin emas" })
  @IsNotEmpty()
  balance: number;
}
