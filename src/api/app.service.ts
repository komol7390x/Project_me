import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config/env.config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Application {
  static async main(): Promise<void> {
    // ========================= DATABASE =========================

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // ========================= VALIDATSIYA =========================
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    // ========================= COOKIE =========================
    app.use(cookieParser());

    const api = 'api';
    // ========================= GLOBAL URL =========================
    app.setGlobalPrefix(api);

    // ========================= SWAGGER =========================
    const configSwagger = new DocumentBuilder()
      .setTitle('Theatr')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      })
      .build();

    const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup(api, app, documentSwagger);

    const logging = new Logger('Swagger-cinemauz');

    // ========================= PORT =========================
    const PORT = Number(config.PORT) ?? 3003;

    await app.listen(PORT, () => {
      setTimeout(() => {
        logging.log(`Swagger UI: http://${config.APP_URL}:${PORT}/${api}`);
      });
    });
  }
}
