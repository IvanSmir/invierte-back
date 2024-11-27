import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const validMimeTypes = {
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  documents: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
};

@Injectable()
export class FileUploadService {
  constructor(@Inject('FIREBASE_STORAGE') private readonly storage: any) {}

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
      throw new BadRequestException('Error uploading files');
    }
  }

  private async processFiles(
    files: Express.Multer.File[] | undefined,
    type: 'images' | 'documents',
  ) {
    if (!files) return [];

    return Promise.all(
      files.map(async (file) => {
        if (!validMimeTypes[type].includes(file.mimetype)) {
          throw new BadRequestException(`Invalid ${type.slice(0, -1)} type`);
        }
        console.log(this.storage);
        const fileName = `${Date.now()}-${file.originalname}`;
        const storageRef = ref(
          this.storage,
          `file/uploads/${type}/${fileName}`,
        );

        try {
          await uploadBytes(storageRef, file.buffer);
          const downloadURL = await getDownloadURL(storageRef);
          return { name: file.originalname, url: downloadURL };
        } catch (error) {
          console.error(`Error uploading file ${file.originalname}:`, error);
          throw new BadRequestException('Error uploading file');
        }
      }),
    );
  }
}
