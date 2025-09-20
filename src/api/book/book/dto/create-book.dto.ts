import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBookDto {
  // ------------------ TITLE ------------------
  @ApiProperty({
    description: 'The title of the book',
    example: 'Lord Rings',
  })
  @IsString()
  title: string;

  // ------------------ AUTHOR ------------------
  @ApiProperty({
    description: 'The author of the book',
    example: 'J.R.Tolkin',
  })
  @IsString()
  author: string;

  // ------------------ PUBLISHED YEAR ------------------
  @ApiProperty({
    description: 'The year the book was published',
    example: '2008-08-02',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
  })
  @IsString()
  published_year: string;

  // ------------------ AVAILABLE ------------------
  @ApiProperty({
    description: 'Indicates whether the book is available',
    example: true,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  avialable?: boolean;
}
