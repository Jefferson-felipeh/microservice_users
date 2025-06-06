import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('common-entity')
export class CommonEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

    @DeleteDateColumn()
    deleted_at:Date
}