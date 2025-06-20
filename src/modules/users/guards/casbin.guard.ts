import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class CasbinGuard implements CanActivate {
    constructor(@Inject('ROLES_SERVICE') private client: ClientProxy) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const getRequest = context.switchToHttp().getRequest();

            const user = getRequest.user;
            const path = getRequest.route.path;
            const method = getRequest.method.toLowerCase();

            const sllowed = await lastValueFrom(
                this.client.send('casbinGuard-require', { user, path, method }),
            );

            return sllowed;
        } catch (error) {
            console.error('Erro no CasbinGuard:', error.message || error);
            throw new ForbiddenException('Acesso não autorizado')
        }
    }
}