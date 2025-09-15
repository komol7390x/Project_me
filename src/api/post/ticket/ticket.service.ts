import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { TicketEntity } from 'src/core/entity/post/ticket.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowtimeEntity } from 'src/core/entity/post/showtime.entity';
import { successRes } from 'src/infrastructure/response/succesRes';

@Injectable()
export class TicketService extends BaseService<
  CreateTicketDto,
  UpdateTicketDto,
  TicketEntity
> {
  constructor(
    // ticket
    @InjectRepository(TicketEntity)
    private readonly ticketRepo: Repository<TicketEntity>,

    // showtime
    @InjectRepository(ShowtimeEntity)
    private readonly showtimeRepo: Repository<ShowtimeEntity>,
  ) {
    super(ticketRepo);
  }
  // ============================ CREATE TICKET ============================

  async createTicket(createTicketDto: CreateTicketDto) {
    const { showtime_id } = createTicketDto;

    // Showtime mavjudligini tekshirish
    const existShowtime = await this.showtimeRepo.findOne({
      where: { id: showtime_id },
    });

    if (!existShowtime) {
      throw new NotFoundException(`Showtime with id ${showtime_id} not found`);
    }

    // ticket_quantity soni
    const ticketsCount = Number(existShowtime.ticket_quantity);
    if (ticketsCount <= 0) {
      return successRes({ message: 'No tickets to create', result: [] });
    }

    // Ticketlarni yaratish
    const ticketsToCreate: TicketEntity[] = [];
    for (let i = 0; i < ticketsCount; i++) {
      ticketsToCreate.push(
        this.ticketRepo.create({
          ...createTicketDto,
          seat_number: i + 1,
        }),
      );
    }

    // DB ga saqlash
    await this.ticketRepo.save(ticketsToCreate);
    const firstTicket = ticketsToCreate[0];
    const lastTicket = ticketsToCreate.at(-1);
    const all_ticket_number = ticketsToCreate.length;
    delete firstTicket?.is_deleted;
    delete lastTicket?.is_deleted;
    return successRes({
      message: 'All tickets created',
      result: {
        firstTicket,
        lastTikect: lastTicket,
      },
      all_ticket_number,
    });
  }

  // ============================ UPDATE TICKET ============================

  async updateTicket(id: number, updateTicketDto: UpdateTicketDto) {
    // distructure
    const { showtime_id } = updateTicketDto;

    // check customer id
    if (showtime_id) {
      await this.findByIdRepository(this.showtimeRepo, showtime_id);
    }

    // update
    return super.update(id, updateTicketDto);
  }
}
