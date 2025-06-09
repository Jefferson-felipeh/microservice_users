import { IsNumber, IsString } from "class-validator"
import { defaultProperty, IsStrongPassword } from "src/common/decorators/swagger.decorator"

export class CreateUserDTO {
    @defaultProperty('Primeiro nome do usuário','Firstname','example')
    @IsString({message: 'FirstName is required type string'})
    firstname: string

    @defaultProperty('Sobrenome do usuário','LastName','example')
    @IsString({message: 'LastName is required type string'})
    lastname: string

    @defaultProperty('Email do usuário','Email','example@gmail.com')
    @IsString({message: 'Email is required type string'})
    email: string

    @defaultProperty('CEP do usuário','CEP','00000-000')
    @IsString({message: 'CEP is required type string'})
    cep: string

    @defaultProperty('Idade do usuário','AGE',18)
    @IsNumber()
    age: number

    @defaultProperty('Senha do usuário','Password','*********')
    @IsString({message: 'Password is required type string'})
    @IsStrongPassword()
    password: string
}