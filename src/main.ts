import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/all-exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'ms_users',//Nome da fila do ms-users;
      queueOptions: {
        durable: true
      }
    }
  });

  // app.useGlobalFilters(new HttpExceptionFilter());
  //Validação com os pipes de forma global_
  app.useGlobalPipes(new ValidationPipe({
    //Podemos passar uma série de propriedades globais para as validações dos dados_

    //Essa propriedade envia na requisição apenas as propriedades que são esperadas, que são aquelas definidas nos dtos_
    whitelist: true,

    //Essa propriedade recusa as requisições que possue propriedades indesejadas, aquelas que não estao presentes no dto,
    //como por exemplo, no dto não tem a propriedade id, caso eu passe esa propriedade na requisição, ele recusa a requisição ate que eu tire da requisição_
    //Portanto, recusa a requisição caso eu passe algum campo que não exista nos dtos_
    forbidNonWhitelisted: true,

    //A propriedade transform captura os dados da requisição, e já faz a mudança da tipagem dos dados, por exemplo, se o DTO espera um campo com o 
    //tipo string, o transform faz essa mudança automaticamente tanto nos dtos quanto nos parametos_
    transform: true,
  }));

  //Configuração do swagger_
  const options = new DocumentBuilder()
    .setTitle('Microservice Users')
    .setDescription('Microserviço de usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .setTitle('Microservice_Users')
    .addTag('MS')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(3030);
}
bootstrap();
