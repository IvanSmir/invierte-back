import { BadRequestException, Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable()
export class FileUploadService {
  private storage: any;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    };
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const storageRef = ref(this.storage, `uploads/${fileName}`);
        await uploadBytes(storageRef, file.buffer);
        return getDownloadURL(storageRef);
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException('Error uploading files');
    }
  }
}
