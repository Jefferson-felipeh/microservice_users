import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Users } from "../entities/Users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "../dtos/createUserDto.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class UsersRepository{

    constructor(

        //Definindo o clientProxy das configurações no módulo_
        @Inject('NOTIFICATIONS_SERVICE') client:ClientProxy,

        //Injetando a entidade User no repositório para ter acesso as suas propriedades e a toda a sua estrutura_
        @InjectRepository(Users)
        private repository:Repository<Users>
    ){}

    //Método responsável por criar um novo usuário no banco de dados mongodb_
    async create(dataBody:CreateUserDTO, passwordHash:string):Promise<Users>{
        //Tratamento de erro com try{} Catch(error){}_
        try{
            //Buscando um eventual email no banco de dados correspondente ao fornecido pelo usuário_
            const isEmail = await this.verifyEmailUser(dataBody.email);

            //Se o email já existir na base de dados, ele retorna uma exceção_
            if(isEmail) throw new HttpException('Email já existe!',400);

            //Caso não exista, ele cria a estrutura da coluna no banco de dados com a mesma estrutura do objeto fornecido pelo usuário,
            //Mas que corresponda a mesma estrutura especificada na entidade_
            const createUser = this.repository.create(dataBody);

            //Caso de erro ao salvar a estrutura, será retornado uma exceção_
            if(!createUser) throw new HttpException('error ao criar usuário!',HttpStatus.BAD_REQUEST);
            
            //Por fim, é salvo as informações do usuáirio no banco de dados, porém passando a senha hasheada_
            const saveUser = await this.repository.save({
                ...createUser,
                password: passwordHash
            });

            //Caso dé erro ao salvar, lança um exceção_
            if(!saveUser) throw new HttpException('error ao salvar usuário!',HttpStatus.BAD_REQUEST);

            //Por fim, caso tudo de certo, retorna o usuário criado_
            return saveUser;

        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    //Método responsável por listar todos os usuários do banco de dados_
    getAll(){
        return this.repository.find();
    }

    //Método responsável por deletar um usuário específico do banco de dados_
    async delete(id:string):Promise<object>{
        try{
            const user = await this.repository.findOneBy({});

            console.log(user);

            if(!user) throw new HttpException('Usuário não encontrado!',HttpStatus.BAD_REQUEST);

            const deleteUser = await this.repository.delete(id);

            return {
                status: 'success',
                message: `Usuário ${user.firstname} deletado com sucesso!`
            };
        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    //Método que recebe o email, e verifica se esse email já existe ou não na base de dados_
    async verifyEmailUser(email:string):Promise<boolean>{
        if(!email) throw new HttpException('Email não informado!',HttpStatus.BAD_REQUEST);

        const isEmail = await this.repository.findOneBy({email});

        if(isEmail) throw new HttpException('Email já já cadastrado!',HttpStatus.BAD_REQUEST);

        return false;
    }
}