import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class HandleDbErrorService {
  private readonly logger = new Logger(HandleDbErrorService.name);

  handleDbError(e: any, type: string, value: string) {
    this.logger.error(e);

    if (e instanceof PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException(`${type} with ${value} already exists`);
        case 'P2003':
          const match = e.message.match(
            /Foreign key constraint failed on the field: `(.+?)`/,
          );
          const field = match ? match[1] : 'unknown field';
          throw new BadRequestException(`The id  for ${field} does not exist.`);
        case 'P2025':
          throw new BadRequestException(`The provided ${type} does not exist`);
        default:
          throw new InternalServerErrorException('Something went wrong');
      }
    } else if (e.code?.startsWith('5')) {
      throw new InternalServerErrorException('Something went wrong');
    }
    throw e;
  }
}
