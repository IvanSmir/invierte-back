import { Module, Global } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

@Global() // Hace que el módulo esté disponible globalmente
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        const firebaseConfig = {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
        };
        return initializeApp(firebaseConfig);
      },
    },
    {
      provide: 'FIREBASE_STORAGE',
      useFactory: (firebaseApp: any) => {
        return getStorage(
          firebaseApp,
          `gs://${process.env.FIREBASE_STORAGE_BUCKET}`,
        );
      },
      inject: ['FIREBASE_APP'],
    },
  ],
  exports: ['FIREBASE_APP', 'FIREBASE_STORAGE'],
})
export class FirebaseModule {}
