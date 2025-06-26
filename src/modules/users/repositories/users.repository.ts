import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Users } from "../entities/Users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "../dtos/createUserDto.dto";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateUserDto } from "../dtos/updateUserDto.dto";
import { lastValueFrom } from "rxjs";

@Injectable()
export class UsersRepository{
    constructor(
        //Definindo o clientProxy das configurações no módulo_
        @Inject('AUTHORIZATION_SERVICE') private client_auth:ClientProxy,


        @Inject('ROLES_SERVICE') private client_role:ClientProxy,

        //Injetando a entidade User no repositório para ter acesso as suas propriedades e a toda a sua estrutura_
        @InjectRepository(Users) private repository:Repository<Users>
    ){}

    //Método responsável por criar um novo usuário no banco de dados mongodb_
    async create(dataBody:CreateUserDTO, passwordHash:string):Promise<Users>{
        //Tratamento de erro com try{} Catch(error){}_
        try{
            //Buscando um eventual email no banco de dados correspondente ao fornecido pelo usuário_
            const isEmail = await this.verifyEmailUser(dataBody.email);

            if(isEmail) throw new HttpException('Email já existe!',400);

            //Caso não exista, ele cria a estrutura da coluna no banco de dados com a mesma estrutura do objeto fornecido pelo usuário,
            //Mas que corresponda a mesma estrutura especificada na entidade_
            const createUser = this.repository.create(dataBody);//Esse método não é assincrono, uma vez que ele so cria os parametros;

            //Caso de erro ao salvar a estrutura, será retornado uma exceção_
            if(!createUser) throw new HttpException('error ao criar usuário!',HttpStatus.BAD_REQUEST);
            
            //Por fim, é salvo as informações do usuáirio no banco de dados, porém passando a senha hasheada_
            const saveUser = await this.repository.save({
                ...createUser,
                password: passwordHash
            });

            //Caso dé erro ao salvar, lança um exceção_
            if(!saveUser) throw new HttpException('error ao salvar usuário!',HttpStatus.BAD_REQUEST);

            //Após definir o client proxy no controller, após salvar o usuário no banco, será enviado um evento contendo os dados do
            //usuário criado para o consumer, que será o microservice que receberá esses dados atravez da fila definida no seu endpoint_
            this.client_auth.emit('ms_auth_pattern',saveUser);

            //Emitindo dados para o microservice de roles_
            this.client_role.emit('ms_roles_pattern',{id:saveUser.id, firstname:saveUser.firstname});

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

    //Método responsável por buscar por um usuário com base no seu id, e retornar os dados desse usuário específico_
    async getOne(id:string):Promise<Users>{
        try{
            const user = await this.repository.findOneBy({id});

            if(!user) throw new HttpException('Usuário não encontrado na base de dados!',400);

            return user;
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }

    async queryUser(firstname:string):Promise<Users[]>{
        try{
            if(!firstname || typeof firstname != 'string') throw new HttpException('Query Inválida!',400);

            return (await this.repository.find()).filter(f => {
                let filterData = false;

                if((firstname !== undefined || firstname) && f.firstname.toLocaleLowerCase().includes(firstname.toLocaleLowerCase())) filterData = true;

                return filterData;
            });
            
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }

    //Método responsável por deletar um usuário específico do banco de dados_
    async delete(id:string):Promise<object>{
        try{
            const user = await this.repository.findOneBy({id});

            if(!user) throw new HttpException('Usuário não encontrado!',HttpStatus.BAD_REQUEST);

            await this.repository.delete(id);

            this.client_role.emit('role_delete',id);

            return {
                status: 'success',
                message: `Usuário ${user.firstname} deletado com sucesso!`,
                date: new Date()
            };
        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    async update(id:string, data:UpdateUserDto):Promise<UpdateUserDto>{
        try{
            /*
                A forma como os dados são atualizados usando o typeorm com o mongodb é diferente,
                Como por exemplo, com o mongodb eu não posso usar o comando:
                const updateUser = await this.repository.update(id,data);
                Pois ele so funciona bem com os bancos relacionais(sqlite,postgrolsql, ...),
                mas com o mongodb ele não atualiza corretamente os dados;

            */

            const user = await this.repository.findOneBy({id});
            
            if(!user) throw new HttpException('Usuário não encontrado na base de dados!',400);

            //Então será usado a propriedade merge() do repository que mescla os dados novos no usuário existente_
            const updatedUser = this.repository.merge(user,data);

            if(!updatedUser) throw new HttpException('Falha ao atualizar dados do usuário!',400);

            //por fim, após mesclar os dados, irei salvar essa alteração no banco de dados_
            const saveUpdate = await this.repository.save(updatedUser);

            return saveUpdate;

            //Ou seja, a abordagem de atualizar dados com o typeorm e bancos relacionais e não relacionais é diferente;
            //O mongodb sempre vai esperar um ObjectId como id para busca no banco de dados;
            
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }

    //Método que recebe o email, e verifica se esse email já existe ou não na base de dados_
    async verifyEmailUser(email:string):Promise<boolean>{
        if(!email) throw new HttpException('Email não informado!',HttpStatus.BAD_REQUEST);

        const isEmail = await this.repository.findOneBy({email});

        if(isEmail) throw new HttpException('Email já cadastrado!',HttpStatus.BAD_REQUEST);

        return false;
    }

    async me(email:string):Promise<object>{
        if(!email) throw new HttpException('erro no email',400);

        const user = await this.repository.findOneBy({email});
        if(!user) throw new HttpException('Usuário não encontrado!',400);

        const rolesToUser = await lastValueFrom(
            this.client_role.send('get-roles-and-permissions',user.id)
        );

        if(!rolesToUser) throw new HttpException('Roles não encontradas',403);

        return {
            user: user,
            roles: rolesToUser
        };
    }
}