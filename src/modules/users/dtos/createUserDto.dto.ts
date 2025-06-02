import { IsNumber, IsString } from "class-validator"

export class CreateUserDTO {
    //DTO utilizado para criação dos usuários_
    @IsString({message: 'FirstName is required type string'})
    firstname: string
    @IsString({message: 'FirstName is required type string'})
    lastname: string
    @IsString({message: 'FirstName is required type string'})
    email: string
    @IsString({message: 'FirstName is required type string'})
    cep: string
    @IsNumber()
    age: number
    @IsString({message: 'FirstName is required type string'})
    password: string
}