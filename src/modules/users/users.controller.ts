import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateUserDTO } from "./dtos/createUserDto.dto";
import { UsersService } from "./users.service";
import { get } from "http";

@Controller({path:'users'})
export class UsersController{

    constructor(private usersService:UsersService){}

    @Post('create')
    async create(@Body() dataBody:CreateUserDTO ):Promise<CreateUserDTO>{
        return this.usersService.create(dataBody);
    }

    @Get('list')
    getAll(){
        return this.usersService.getAll();
    }

    @Delete('delete/:id')
    delete(@Param('id') id:string):Promise<object>{
        return this.usersService.delete(id);
    }
}
