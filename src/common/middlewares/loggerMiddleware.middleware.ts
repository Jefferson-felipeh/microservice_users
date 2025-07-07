import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: any, res: any, next: NextFunction) {
        //Aqui dentro é onde construimos a lógica de dados do middleware_
        console.log(req?.headers?.authorization);
        next();
    }
}