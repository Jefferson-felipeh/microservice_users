import { Column, MigrationInterface, QueryRunner, Table } from "typeorm";

/*
    Esse arquivo de migração servirá para adicionar ou remover colunas e tabelas do banco de dados,
    dependendo das configurações do dataSource_
*/

export class CreateMigrationEntity1750439951078 implements MigrationInterface {

    //Esse comando é executado quando eu rodo ou adiciono uma migração para o banco de dados_
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'ms_group',//Nome da tabela;
            columns: [//definindo as colunas e suas caracteristicas que essa tabela terá;
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'description',
                    type: 'varchar'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }));
    }

    //Esse método é executado quando rodo o comando para reverter uma migração_
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ms_group');
    }

}
