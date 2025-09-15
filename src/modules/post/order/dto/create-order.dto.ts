import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 2,
    description: 'Buyurtma qilinayotgan mahsulot soni',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'Buyurtma qilayotgan customer ID',
  })
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @ApiProperty({
    example: 5,
    description: 'Buyurtma qilinayotgan product ID',
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
