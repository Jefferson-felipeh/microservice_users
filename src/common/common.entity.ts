import { CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('common-entity')
export class CommonEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @CreateDateColumn({name: 'CREATED_AT', type: Date})
    created_at:Date

    @UpdateDateColumn({name: 'UPDATED_AT', type:Date})
    updated_at:Date

    @DeleteDateColumn({name: 'DELETED_AT', type: Date})
    deleted_at:Date
}