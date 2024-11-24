import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  @ApiProperty({
    description: 'The id of the lot to reserve',
  })
  lotId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The phone number of the person reserving the lot',
  })
  phone: string;
}
