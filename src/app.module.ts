import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { PorpertyModule } from './property/property.module';
import { ReservationModule } from './reservation/reservation.module';
import { FirebaseModule } from './firebase/firebase.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    AppModule,
    CommonModule,
    PorpertyModule,
    ConfigModule.forRoot(),
    ReservationModule,
    FirebaseModule,
    SupabaseModule,
  ],
  exports: [ConfigModule],
})
export class AppModule {}
