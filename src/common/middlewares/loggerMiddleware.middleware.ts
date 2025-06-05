import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: any, res: any, next: (error?: any) => void) {
        //Aqui dentro é onde construimos a lógica de dados do middleware_
    }
}