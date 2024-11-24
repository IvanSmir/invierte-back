import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PropertyController],
  imports: [AuthModule],
  providers: [
    PropertyService,
    PrismaService,
    HandleDbErrorService,
    FileUploadService,
  ],
})
export class PorpertyModule {}
