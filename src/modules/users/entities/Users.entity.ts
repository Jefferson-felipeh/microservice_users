import { CommonEntity } from "src/common/common.entity";
import { Column, Entity, Index, Unique } from "typeorm";

@Entity('users')
@Unique(['email'])
export class Users extends CommonEntity{

    //Primeiro nome do usuário_
    @Index('FIRSTNAME')
    @Column({ name: 'FIRSTNAME',type: 'varchar', length:2000, nullable: false })
    firstname:string

    //Segundo nome do usuário_
    @Index('LASTNAME')
    @Column({ name: 'LASTNAME', type: 'varchar', length: 2000, nullable: false, default: ''})
    lastname:string

    //Email do usuário_
    @Column({ name: 'EMAIL', type: 'varchar', length: 2000, nullable:false, unique: true })
    email:string

    //Cep do usuário_
    @Index('CEP')
    @Column({name: 'CEP', type: 'varchar', length:100, nullable: false})
    cep:string

    @Index('AGE')
    @Column({name: 'AGE', type: 'int', nullable: false})
    age:number

    //Senha do usuário_
    @Column({name: 'PASSWORD', type: 'varchar', length: 2000, nullable: false})
    password:string

}