import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Users } from "./entities/Users.entity";
import { UsersRepository } from "./repositories/users.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JWTStrategy } from "./strategys/jwtStrategy.strategy";
import { JwtGuard } from "./guards/jwt.guard";
import { CasbinGuard } from "./guards/casbin.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),//Especificando a entidade principal desse módulo de usuários;

        //Conectando com o receptor do microservice de autenticação_
        ClientsModule.register([
            {
                //Name do clientProxy_
                name: 'AUTHORIZATION_SERVICE',
                //Transport_
                transport: Transport.RMQ,
                //options
                options: {
                    //Url do endereço do broker robbitmq_
                    urls: ['amqp://guest:guest@localhost:5672'],
                    //Nome da fila no broker_
                    queue: 'ms_auth',//Se conectando com a fila do ms_auth;
                    queueOptions: {
                        durable: true,
                    }
                },

            }
        ]),

        //Conectando com o receptor do microservice de roles_
        ClientsModule.register([
            {
                transport: Transport.RMQ,
                name: 'ROLES_SERVICE',
                options: {
                    urls: ['amqp://guest:guest@localhost:5672'],
                    queue: 'ms_role',
                    queueOptions: {
                        durable: true
                    }
                }
            }
        ]),
    ],
    controllers: [UsersController],
    providers: [
        UsersService, 
        UsersRepository,
        JwtGuard,
        JWTStrategy,
        CasbinGuard
    ],
    exports: [
        CasbinGuard
    ]
})
export class UsersModule{}