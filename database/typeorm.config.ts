import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export class TypeormConfig implements TypeOrmOptionsFactory{
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: 'mongodb',
            database: 'users_linkedin_clone',
            url: 'mongodb://localhost:27017',
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