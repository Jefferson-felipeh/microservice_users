import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dtos/createUserDto.dto";
import { UsersRepository } from "./repositories/users.repository";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "./dtos/updateUserDto.dto";
import { QueryUserDto } from "./dtos/queryUserDto.dto";

@Injectable()
export class UsersService{

    constructor(private repository:UsersRepository){}

    //Método responsável por validar os dados antes de serem enviados ao repositório, cumprindo o principio da responsabilidade unica_
    async create(dataBody:CreateUserDTO):Promise<CreateUserDTO>{
        try{

            if(!dataBody) throw new HttpException('error nos dados do usuário!',HttpStatus.BAD_REQUEST);

             let salt = await bcrypt.genSalt(10);
            let passwordHash = await bcrypt.hash(dataBody.password,salt);

            return await this.repository.create(dataBody,passwordHash);
        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    //Método que chama o método do repositório que lista todos os usuários_
    getAll(){
        return this.repository.getAll();
    }

    async getOne(_id:string):Promise<CreateUserDTO>{
        try{
            if(!_id) throw new HttpException('Identificador Inválido!',400);
            
            const user = await this.repository.getOne(_id);
    
            if(!user) throw new HttpException('Usuário não encontrado!',400);
    
            return user;
        }catch(error){
            throw new HttpException(error,400);
        }
    }

    async queryUser(query:Partial<QueryUserDto>):Promise<QueryUserDto[]>{
       try{
        if(!query || !query.firstname) throw new HttpException('Erro na consulta de dados',400);

        return this.repository.queryUser(query.firstname);

       }catch(error){
        throw new HttpException(error.message || error,400);
       }
    }

    //Método responsavel por validar as informações fornecidas para deletar um usuário especifico com base no seu id_
    async delete(id:string):Promise<object>{
        try{
            if(!id) throw new HttpException('Id não encontrado!',HttpStatus.BAD_REQUEST);

            return this.repository.delete(id);
            
        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    async update(_id:string, data:UpdateUserDto):Promise<UpdateUserDto>{
        try{
            if(!_id && !data) throw new HttpException('Dados não fornecidos corretamente!',400);
    
            return await this.repository.update(_id,data);
        }catch(error){
            throw new HttpException(error.message || error,400);
        }
    }
}