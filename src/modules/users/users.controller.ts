import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateUserDTO } from "./dtos/createUserDto.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/updateUserDto.dto";
import { QueryUserDto } from "./dtos/queryUserDto.dto";

@Controller({ path: 'users' })
export class UsersController {

    constructor(private usersService: UsersService) { }

    /* 
        Foi observado um comportamento nas funcionalidades dos endpoints: 
        - No Nestjs(e no framework subjacente, que é o Express), as rotas são avaliadas em ordem sequencial,
        ou seja, a ordem em que as rotas sao definidas no controller importam.
        Por exemplo, foi definido dois endpoints, um genérico onde eu preciso definir um parametro id,
        e o outro uma rota estática onde eu não defino nenhum parametro.
        Se eu definir a rota estática depois da rota genérica(com parametro dinamico),
        a rota estática vai acabar enviando uma requisição como o parametro passado na rota dinamica,
        por exemplo, o NestJS envia "query" como "id" para o método findOne, e o seu código tenta
        buscar usuário com ID "query", o que gera um erro, especialmente se estiver esperando um ObjectID.
        Por tanto, definir rotas estáticas antes das rotas genericas(dinâmicas) para que a rota estática
        não receba os parãmetros das rotas dinamicas.
    */

   @Get('query')
   async queryUser(@Query() query:QueryUserDto):Promise<QueryUserDto[]> {
       return this.usersService.queryUser(query);
    }
    
    @HttpCode(200)
    @Post('create')
    async create(@Body() dataBody: CreateUserDTO): Promise<CreateUserDTO> {
        return this.usersService.create(dataBody);
    }

    @Get('list')
    getAll(){
        return this.usersService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        if(!id) throw new HttpException('ID Inválido!',400);
        return this.usersService.getOne(id);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string): Promise<object> {
        if(!id) throw new HttpException('ID Inválido!',400);
        return this.usersService.delete(id);
    }

    @HttpCode(200)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<UpdateUserDto> {
        if(!id) throw new HttpException('ID Inválido!',400);
        return this.usersService.update(id, data);
    }
}
