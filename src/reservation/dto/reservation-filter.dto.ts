import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReservationFilterDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}
