import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBorrowDto {
  // ------------------ USER ID ------------------
  @ApiProperty({
    description: 'Reader id',
    example: 1,
    type: 'number'
  })
  @IsNumber()
  user_id: number;
  // ------------------ BOOK ID ------------------
  @ApiProperty({
    description: 'Book id',
    example: 1,
    type: 'number'
  })
  @IsNumber()
  book_id: number;

  // ------------------ RETURN DATE ------------------
  @ApiProperty({
    description: 'when will returned book',
    example: '2025-09-20',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  return_date: string;
}