import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Users } from "./entities/Users.entity";
import { UsersRepository } from "./repositories/users.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),//Especificando a entidade principal desse módulo de usuários;

        ClientsModule.register([
            {
                //Name do clientProxy_
                name: 'NOTIFICATIONS_SERVICE',
                //Transport_
                transport: Transport.RMQ,
                //options
                options: {
                    //Url do endereço do broker robbitmq_
                    urls: ['amqp://guest:guest@rabbitmq:5672'],
                    //Nome da fila no broker_
                    queue: 'notifications_queue',
                    queueOptions: {
                        durable: true,
                    }
                },

            }
        ])
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository]
})
export class UsersModule{}