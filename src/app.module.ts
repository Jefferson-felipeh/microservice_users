import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from 'database/typeorm.config';
import { groupModules } from './modules';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig
    }),
    ...groupModules
  ],
})
export class AppModule {}
