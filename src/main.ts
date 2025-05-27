import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


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
  await app.listen(5055);
}
bootstrap();
