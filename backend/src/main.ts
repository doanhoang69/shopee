import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CoreModule } from './core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('App is listening on port http://localhost:3000');
  });
}
bootstrap();
