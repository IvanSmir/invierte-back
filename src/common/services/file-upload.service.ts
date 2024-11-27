import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly supabaseService: SupabaseService) {}
  BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

  async uploadFiles(files: {
    images?: Express.Multer.File[];
    documents?: Express.Multer.File[];
  }) {
    try {
      const results = {
        images: await this.processFiles(files.images, 'images'),
        documents: await this.processFiles(files.documents, 'documents'),
      };
      return results;
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading files');
    }
  }

  private async processFiles(
    files: Express.Multer.File[] | undefined,
    type: 'images' | 'documents',
  ) {
    if (!files) return [];
    console.log(this.BUCKET_NAME);
    return Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const path = `uploads/${type}/${fileName}`;
        const url = await this.supabaseService.uploadFile(
          file,
          this.BUCKET_NAME,
          path,
        );
        return { name: file.originalname, url };
      }),
    );
  }
}
