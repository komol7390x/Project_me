import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBorrowDto } from './create-borrow.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {
  // ------------------ BORROW DATE ------------------
  @ApiProperty({
    description: 'borrow day when',
    example: '2025-09-16',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
  })
  @IsString()
  @IsOptional()
  borrow_date?: string;

  // ------------------ DUE DATE ------------------
  @ApiProperty({
    description: 'how many date borrow',
    example: '2025-09-23',
  })
  @IsString()
  @IsOptional()
  due_date?: string;
  // ------------------ OVERDUE ------------------
  @ApiProperty({
    description: 'overdue is active',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  overdue?: boolean;
}
