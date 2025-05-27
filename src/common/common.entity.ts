import { CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity('common-entity')
export class CommonEntity{
    @ObjectIdColumn('uuid')
    id:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

    @DeleteDateColumn()
    deleted_at:Date
}