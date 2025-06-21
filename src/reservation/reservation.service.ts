import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationFilterDto } from './dto/reservation-filter.dto';
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

  async findAll(filterDto?: ReservationFilterDto) {
    try {
      const { limit = 10, page = 1 } = filterDto || {};
      const offset = (page - 1) * limit;

      const [reservations, total] = await Promise.all([
        this.prisma.reservation.findMany({
          skip: offset,
          take: limit,
          include: {
            User: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
            lot: {
              select: {
                id: true,
                propertyId: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        }),
        this.prisma.reservation.count(),
      ]);

      return {
        data: reservations,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      this.handleDbError.handleDbError(error, 'reservation', 'findAll');
    }
  }
}
