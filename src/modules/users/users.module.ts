import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Users } from "./entities/Users.entity";
import { UsersRepository } from "./repositories/users.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository]
})
export class UsersModule{}