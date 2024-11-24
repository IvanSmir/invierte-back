import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';

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
  findAll() {
    return this.reservationService.findAll();
  }
}
