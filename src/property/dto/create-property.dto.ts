import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsLatitude,
  IsLongitude,
  MinLength,
  ValidateNested,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

enum LotStatus {
  available = 'available',
  reserved = 'reserved',
  sold = 'sold',
}

class CreateLotDto {
  @IsString()
  @ApiProperty({
    example: 'A-1',
    description: 'Number or identifier of the lot',
  })
  number: string;

  @IsNumber()
  @ApiProperty({
    example: 150,
    description: 'Area of the lot in square meters',
  })
  area: number;

  @IsNumber()
  @ApiProperty({ example: 75000, description: 'Price of the lot' })
  price: number;

  @IsEnum(LotStatus)
  @ApiProperty({
    example: LotStatus.available,
    enum: LotStatus,
    description: 'Current status of the lot',
  })
  status: LotStatus;

  @IsArray()
  @ApiProperty({
    example: [
      [-25.2867, -57.3333],
      [-25.2864, -57.3333],
      [-25.2864, -57.333],
      [-25.2867, -57.333],
    ],
    description: 'Coordinates defining the lot boundaries',
  })
  coordinates: number[][];
}

export class CreatePropertyDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    example: 'Sunset Valley Plot',
    description: 'Name of the property',
  })
  name: string;

  @IsString()
  @MinLength(10)
  @ApiProperty({
    example: 'Hermoso terreno con vistas panorámicas a las montañas.',
    description: 'Description of the property',
  })
  description: string;

  @IsNumber()
  @ApiProperty({ example: 250000, description: 'Price of the property' })
  price: number;

  @IsNumber()
  @ApiProperty({
    example: 500,
    description: 'Size of the property in square meters',
  })
  size: number;

  @IsString()
  @ApiProperty({ example: 'Residencial', description: 'Type of the property' })
  type: string;

  @IsString()
  @ApiProperty({
    example: '123 Valley Road, Mountain View, CA',
    description: 'Exact location of the property',
  })
  location: string;

  @IsArray()
  @ApiProperty({
    example: [
      [-25.2867, -57.3333],
      [-25.2864, -57.3333],
      [-25.2864, -57.333],
      [-25.2867, -57.333],
    ],
    description: 'Coordinates defining the lot boundaries',
  })
  coordinates: number[][];

  @IsString()
  @ApiProperty({
    example: 'P-12345',
    description: 'Unique property number assigned to the property',
  })
  propertyNumber: string;

  @IsString()
  @ApiProperty({
    example: 'Registro de la Propiedad N° 12345, Folio Real Matricula N° 98765',
    description: 'Registry information of the property',
  })
  registryInfo: string;

  @IsString()
  @ApiProperty({ example: '1', description: 'Department ID of the property' })
  departmentId: string;

  @IsString()
  @ApiProperty({ example: '1', description: 'City ID of the property' })
  cityId: string;

  @IsString()
  @ApiProperty({ example: '1', description: 'Neighborhood ID of the property' })
  neighborhoodId: string;

  @IsString()
  @ApiProperty({
    example: 'Av. Principal 123',
    description: 'Address of the property',
  })
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLotDto)
  @ApiProperty({
    type: [CreateLotDto],
    description: 'Array of lots associated with the property',
  })
  lots: CreateLotDto[];
}
