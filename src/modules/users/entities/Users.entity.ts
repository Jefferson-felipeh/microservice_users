import { CommonEntity } from "src/common/common.entity";
import { Column, Entity } from "typeorm";

@Entity('users')
export class Users extends CommonEntity{

    //Primeiro nome do usuário_
    @Column()
    firstname:string

    //Segundo nome do usuário_
    @Column()
    lastname:string

    //Email do usuário_
    @Column()
    email:string

    //Cep do usuário_
    @Column()
    cep:string

    @Column()
    age:number

    //Senha do usuário_
    @Column()
    password:string

}