import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './common/config/database.config';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';
import { UsersModule } from './modules/users/users.module';
import { MiddlewareBuilder } from '@nestjs/core';
import { LoggerMiddleware } from './common/middlewares/loggerMiddleware.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,//Tornando as variaveis do arquivo .env globais para toda aplicação;
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      //Esse é o namespace(espaço nomeado), que agrupa e organiza variaveis relacionadas do .env_
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({//Configurações do typeorm_
      useClass: TypeOrmConfigService,
    }),

    UsersModule,
  ],
  providers: [
    //As configurações do Typeorm é injetável_
    TypeOrmConfigService
  ]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware)
      .forRoutes('/users/user-permissions')
  }
}
