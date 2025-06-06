import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

//As configurações do typeorm precisa ser uma injectable()_
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory{
    
    constructor(private configService:ConfigService){}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        
        return {
            
            //Configuração das propriedades para conxão com o banco de dados postgres_
            type: this.configService.get<string>('database.type'),
            database: this.configService.get<string>('database.nome'),
            host: this.configService.get<string>('database.host'),
            port: this.configService.get('database.port'),
            username: this.configService.get<string>('database.username'),
            password: this.configService.get<string>('database.password'),

            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            synchronize: true,
            cli: {
                entitiesDir: 'src',
                migrationsDir: 'src/modules/subscribe',
                subscribersDir: 'subscriber'
            },

            logger:'file',
            logging:true,
            subscribers: [],
            autoLoadEntities: true
        } as TypeOrmModuleOptions
    }
}