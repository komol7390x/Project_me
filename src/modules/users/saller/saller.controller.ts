import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SallerService } from './saller.service';
import { CreateSallerDto } from './dto/create-saller.dto';
import { UpdateSallerDto } from './dto/update-saller.dto';

@Controller('saller')
export class SallerController {
  constructor(private readonly sallerService: SallerService) {}

  @Post()
  create(@Body() createSallerDto: CreateSallerDto) {
    return this.sallerService.create(createSallerDto);
  }

  @Get()
  findAll() {
    return this.sallerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.sallerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSallerDto: UpdateSallerDto,
  ) {
    return this.sallerService.update(+id, updateSallerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.sallerService.remove(+id);
  }
}
