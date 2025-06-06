import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { groupModules } from './modules';
import databaseConfig from './common/config/database.config';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';

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
    ...groupModules,
  ],
  providers: [TypeOrmConfigService]
})
export class AppModule {}
