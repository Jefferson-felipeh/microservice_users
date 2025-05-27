import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dtos/createUserDto.dto";
import { UsersRepository } from "./repositories/users.repository";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService{

    constructor(private repository:UsersRepository){}

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

    getAll(){
        return this.repository.getAll();
    }

    async delete(id:string):Promise<object>{
        try{
            if(!id) throw new HttpException('Id não encontrado!',HttpStatus.BAD_REQUEST);

            return this.repository.delete(id);
            
        }catch(error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
}