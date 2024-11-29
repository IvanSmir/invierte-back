import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  fullName: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email for the user',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'strongpassword',
    description: 'Password for the user',
  })
  password: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'strongpassword',
    description: 'Password for the user',
  })
  confirmPassword: string;
}
