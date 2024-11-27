import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email for the user',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({
    example: 'strongpassword',
    description: 'Password for the user',
  })
  password: string;
}
