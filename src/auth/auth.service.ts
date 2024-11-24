import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { password, confirmPassword, ...userData } = createUserDto;

      if (password !== confirmPassword)
        throw new BadRequestException('Passwords do not match');

      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        },
      });

      delete user.password;
      delete user.isActive;
      delete user.roles;

      return {
        user: user,
        token: this.getJwtToken({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }),
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'user',
        createUserDto.email,
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.prismaService.user.findUnique({
        where: { email },
        select: {
          email: true,
          password: true,
          id: true,
          fullName: true,
          isActive: true,
        },
      });

      if (!user) throw new BadRequestException('Invalid credentials');
      if (!user.isActive)
        throw new BadRequestException('User disabled, contact support');
      if (!bcrypt.compareSync(password, user.password))
        throw new BadRequestException('Invalid credentials');

      delete user.password;
      delete user.isActive;

      return {
        user: user,
        token: this.getJwtToken({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }),
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'User',
        loginUserDto.email,
      );
    }
  }

  async checkAuthStatus(user: User) {
    return {
      user: user,
      token: this.getJwtToken({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
