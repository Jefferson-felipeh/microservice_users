import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from 'database/typeorm.config';
import { groupModules } from './modules';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,//Tornando as variaveis do arquivo .env globais para toda aplicação;
      load: [],
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({//Configurações do typeorm_
      useClass: TypeormConfig
    }),
    ...groupModules
  ],
})
export class AppModule {}
