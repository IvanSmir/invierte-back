import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { User } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly handleDbError: HandleDbErrorService,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: User) {
    try {
      const reservation = await this.prisma.reservation.create({
        data: {
          ...createReservationDto,
          userId: user.id,
        },
      });
      await this.prisma.lot.update({
        where: {
          id: reservation.lotId,
        },
        data: {
          status: 'reserved',
        },
      });
      return reservation;
    } catch (error) {
      this.handleDbError.handleDbError(error, 'reservation', 'create');
    }
  }

  async findAll() {
    try {
      const reservations = await this.prisma.reservation.findMany();
      return reservations;
    } catch (error) {
      this.handleDbError.handleDbError(error, 'reservation', 'findAll');
    }
  }
}
