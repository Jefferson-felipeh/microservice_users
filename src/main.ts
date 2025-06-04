import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: false }));

  //Configuração do swagger_
  const options = new DocumentBuilder()
  .setTitle('Microservice Users')
    .setDescription('Microserviço de usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .setTitle('MS')
    .addTag('MS')
    .addServer('MS')
    .build();

  const document = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup('docs',app,document);

  await app.startAllMicroservices();
  await app.listen(3030);
}
bootstrap();
