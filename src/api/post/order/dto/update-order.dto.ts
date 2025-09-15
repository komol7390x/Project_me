import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
