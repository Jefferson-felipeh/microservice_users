import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt} from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:'jeffersons',
        });
    }

    //Estratégia JWT adicionada aos endpoints para autorização de usuários atraves de um token válido fornecido_
    async validate(payload:{user:string,sub:string, exp}){
        if(!payload.user || !payload.sub) throw new UnauthorizedException();
        
        const expirationInSeconds = payload.exp;
        const currentInSeconds = Math.floor(Date.now() / 1000);

        const secondsLeft = expirationInSeconds - currentInSeconds;
        if(secondsLeft > 60) console.log(secondsLeft/60);
        else console.log(secondsLeft);

        return {
            user: payload.user,
            sub:payload.user,
            exp: payload.exp
        }
    }
}