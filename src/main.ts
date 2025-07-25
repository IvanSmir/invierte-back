import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({}));

  const config = new DocumentBuilder()
    .setTitle('Inverte API')
    .setDescription('Inverte API')
    .setVersion('1.0')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
