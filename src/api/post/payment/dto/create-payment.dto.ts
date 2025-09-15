import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Payment } from 'src/common/enum/payment';

export class CreatePaymentDto {
  // ------------------------------ STATUS ------------------------------
  @ApiPropertyOptional({
    description: "To'lov holati",
    enum: Payment,
    example: Payment.PAID,
  })
  @IsOptional()
  @IsEnum(Payment)
  status?: Payment;

  // ------------------------------ TOTAL PRICE ------------------------------
  @ApiPropertyOptional({
    description: "To'lov summasi",
    example: 49.99,
  })
  @IsNumber()
  @IsOptional()
  total_price: number;

  // ------------------------------ ORDER ID ------------------------------
  @ApiProperty({
    description: 'Buyurtma ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  order_id: number;
}
