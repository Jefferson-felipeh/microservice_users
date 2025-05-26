import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from 'database/typeorm.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig
    })
  ],
})
export class AppModule {}
