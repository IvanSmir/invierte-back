import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationFilterDto } from './dto/reservation-filter.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Auth()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser() user: User,
  ) {
    return this.reservationService.create(createReservationDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() filterDto: ReservationFilterDto) {
    return this.reservationService.findAll(filterDto);
  }
}
