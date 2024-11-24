import { Module } from '@nestjs/common';
import { HandleDbErrorService } from './services/handle-db-error.service';
import { FileUploadService } from './services/file-upload.service';

@Module({
  providers: [HandleDbErrorService, FileUploadService],
  exports: [HandleDbErrorService],
})
export class CommonModule {}
