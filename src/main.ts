import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OnlyErrorLogger } from './error/error-message';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  logger: new OnlyErrorLogger(),
});

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  }))

  const config = new DocumentBuilder()
    .setTitle('Online Course')
    .setDescription('CRUD online course')
    .setVersion('1.0')
    .addTag('course')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const PORT = Number(process.env.PORT) ?? 3000    
  await app.listen(PORT, () => console.log('Server is runing:',PORT));
}
bootstrap();
