import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Users } from "../entities/Users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDTO } from "../dtos/createUserDto.dto";

@Injectable()
export class UsersRepository{

    constructor(
        @InjectRepository(Users)
        private repository:Repository<Users>
    ){}

    async create(dataBody:CreateUserDTO, passwordHash:string):Promise<Users>{
        try{
            const isEmail = await this.verifyEmailUser(dataBody.email);

            if(isEmail) throw new HttpException('Email já existe!',400);

            const createUser = this.repository.create(dataBody);

            if(!createUser) throw new HttpException('error ao criar usuário!',HttpStatus.BAD_REQUEST);
            
            const saveUser = await this.repository.save({
                ...createUser,
                password: passwordHash
            });

            if(!saveUser) throw new HttpException('error ao salvar usuário!',HttpStatus.BAD_REQUEST);

            return saveUser;

        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    getAll(){
        return this.repository.find();
    }

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

    async verifyEmailUser(email:string):Promise<boolean>{
        if(!email) throw new HttpException('Email não informado!',HttpStatus.BAD_REQUEST);

        const isEmail = await this.repository.findOneBy({email});

        if(isEmail) throw new HttpException('Email já já cadastrado!',HttpStatus.BAD_REQUEST);

        return false;
    }
}