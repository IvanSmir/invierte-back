import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReservationController],
  imports: [AuthModule],
  providers: [ReservationService, PrismaService, HandleDbErrorService],
})
export class ReservationModule {}
