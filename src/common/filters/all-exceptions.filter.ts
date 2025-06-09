import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException
        ? exception.getStatus() 
        : HttpStatus.INTERNAL_SERVER_ERROR;

        response
        .status(status)
        .json(this.messageStatusCode(status,exception,request))
    }

    private messageStatusCode = (
        statusCode:number,
        exception: HttpException,
        request: Request
    ) => {
        if(statusCode == 400) return {
            httpException : {
                statusCode:statusCode.toString(),
                message: {
                    error: {
                        exception: exception.message,
                        req: request.statusCode
                    },
                    description: (exception instanceof HttpException ? exception.getStatus() : HttpStatus.BAD_REQUEST),
                    body: {
                        data: request.body
                    }
                }
            }
        }
    }
}