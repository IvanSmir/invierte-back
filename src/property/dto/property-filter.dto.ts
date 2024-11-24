import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PropertyFilterDto {
  @IsString()
  @ApiProperty({ example: '1', description: 'Department ID of the property' })
  departmentId: string;

  @IsString()
  @ApiProperty({ example: '1', description: 'City ID of the property' })
  cityId: string;

  @IsString()
  @ApiProperty({ example: '1', description: 'Neighborhood ID of the property' })
  neighborhoodId: string;
}
