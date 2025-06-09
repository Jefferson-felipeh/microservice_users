/*
    > Eu posso utilizar validationConstraint para verificar as senhas, se elas possuem numeros, letra maiuscula, 
    letra minuscula e caracteres especiais, para validação customizada;

    > Eu posso criar decorators personalizados para as propriedades da aplicação, como propriedades swagger e etc.
*/

//Essa validação customizada terá a funcionalidade de verificar se as senhas criadas pelos usuários:
//1. Possue letras maiusculas
//2. Possue letras minúsculas
//3. Possue números
//4. Possue Algum caractere especial

import { applyDecorators, HttpException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

//Criando uma validação customizada_
@ValidatorConstraint({name: 'isStrongPassword',async: false})
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface{
    length:boolean;
    letterHasUppercase:boolean;
    letterHasLowecase:boolean;
    numberHas:boolean;
    hasSpecialChar:boolean;


    validate(password: string, validationArguments?: ValidationArguments): boolean {
        //Verificar se a senha é maior ou igual a 8 caracteres_
        this.length = password.length >= 8 && password.length <= 12;
        //Primeiro vamos verificar se a senha possue letras Maiusculas_
        this.letterHasUppercase = /[A-Z]/.test(password);
        //Segundo verificar se a senha possue letras minusculas_
        this.letterHasLowecase = /[a-z]/.test(password);
        //Terceiro verificar se há numeros_
        this.numberHas = /\d/.test(password);
        //Por fim verificar se há caracteres especiais_
        this.hasSpecialChar = /[\W_]/.test(password);

        
        return this.length && this.letterHasUppercase && this.letterHasLowecase && this.numberHas && this.hasSpecialChar;
    }
    
    isValid(length,letterHasUppercase,letterHasLowecase,numberHas,hasSpecialChar){
        if(!length) return 'A senha precisar ter de 8 a 12 caracteres!';
        if(!letterHasUppercase) return 'A senha deve conter pelo menos uma letra maiuscula!';
        if(!letterHasLowecase) return 'A senha deve conter pelo menos uma letra minúscula!';
        if(!numberHas) return 'A senha deve conter pelo menos um número!';
        if(!hasSpecialChar) return 'A senha deve conter pelo menos um caractere especial!';
    }
    
    defaultMessage(validationArguments?: ValidationArguments): string {
        const validPassword = this.isValid(this.length,this.letterHasUppercase,this.letterHasLowecase,this.numberHas,this.hasSpecialChar);

        if(!validPassword) throw new HttpException('Erro ao retornar dados!',400);

        return validPassword;
    }
}

/*
    Observa que, apesar de criar o validator personalizado para verificar as caracteristicas da senha,
    eu tive que criar um decorator que esta chamando esse validator customizado, e so assim ser utilizado 
    no campo password do dto_
*/

//O decorator personalizado será apenas uma função_
export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        //u preciso especificar que esse é um decoration_
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsStrongPasswordConstraint,
        });
    };
}

/*
    Os validators customizados ou personalizados precisam ser registrados como decorators para que 
    possam ser usado diretamente nos dtos. E esse padrão se repete sempre que queremos criar validações customizadas
    usando class-validators.
    Ou seja, quando criamos um validatorConstraint, ele sozinho nao pode ser usado diretamente como um decorator nos dtos,
    ele serve apenas como uma classe de validação, definindo as regras. Para que possamos chama-lo com @IsStringPasswor() 
    como decorador no dto, precisamos registra-lo manualmente usando registerDecorator.

    Sempre que quisermos um decorator de validação personalizado, ele deve sempre seguir essa estrutura:
     - Deve ser sempre criado uma classe com o decorator.
     - @ValidatorConstraint(). 
     - implementando o ValidatorConstraintInterface.
     - que nos fornecerá métodos específicos para verificação e validação de dados.
     - Depois temos que criar uma função que vai chamar essa classe.
     - Essa função terá a propriedade registerDecorator() para chamar a classe.
     - E por fim, esse registerDecorator é chamado nos dtos.
*/

//-----------------------------------------------------------------------------------------------------------

//Demais decorators que serão usado nos dtos e nos controller_
export function defaultProperty(message:string, field:string,example){
    return applyDecorators(
        ApiProperty({description: message, example: example}),
        IsNotEmpty({message: `${field} is required!`})
    )
}

export function defaultApiController(descriptionEndPoint:string){
    return applyDecorators(
        ApiOperation({description: descriptionEndPoint}),
        ApiOkResponse({description: 'Solicitação bem sucedida!'}),
        ApiBadRequestResponse({description: 'Erro na solicitação!'}),
    )
}