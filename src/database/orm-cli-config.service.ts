import { DataSource } from "typeorm";
import { CreateMigrationEntity1750439951078 } from "./migrations/1750439951078-CreateMigrationEntity";

export const dataSource = new DataSource({
    //Configuração do dataSource_
    //Esse arquivo servirá para se conectar ao anco de dados e adicionar/executar as migrações_
    type: 'postgres',
    database: 'microservce_users',
    host: 'localhost',
    port: 5432,
    username: 'jefferons',
    password: 'JFS0211@ti',
    synchronize: false,
    migrations: [CreateMigrationEntity1750439951078]
});