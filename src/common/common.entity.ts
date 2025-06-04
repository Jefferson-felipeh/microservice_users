import { ObjectId } from "mongodb";
import { CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity('common-entity')
export class CommonEntity{
    //O @ObjectIdColumn() é um decorador espcial do typeorm para indicar que esse campo é o _id do mongoDB_
    @ObjectIdColumn()
    _id:ObjectId

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

    @DeleteDateColumn()
    deleted_at:Date
}