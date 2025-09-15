import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

interface IProduct {
  name: string;
  price: number;
  stock_quantity?: number;
  image_url?: string;
  saller_id: number;
  category_id: number;
}

export class CreateProductDto implements IProduct {
  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'Mahsulot nomi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1500,
    description: 'Mahsulot narxi',
  })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 50,
    description: 'Ombordagi mahsulot soni',
    required: false,
  })
  @Min(0)
  @IsNumber()
  @IsOptional()
  stock_quantity: number;

  @ApiProperty({
    example: 'image.png',
    description: 'Mahsulot rasmi (URL)',
    required: false,
  })
  @IsString()
  @IsOptional()
  image_url: string;

  @ApiProperty({
    example: 1,
    description: 'Mahsulotni qo\'shgan sotuvchi ID',
  })
  @IsNumber()
  @IsNotEmpty()
  saller_id: number;

  @ApiProperty({
    example: 3,
    description: 'Mahsulot kategoriyasi ID',
  })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
