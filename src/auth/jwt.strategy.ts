
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        // Вариант 1. Проверяем Authorization header
        const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        
        // Вариант 2. Проверяем куки
        const tokenFromCookie = req.cookies?.access_token;
        
        // Возвращаем токен из заголовка или куки
        return tokenFromHeader || tokenFromCookie;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });

  }


  async validate(payload: any) {
    return { sub: payload.sub, username: payload.login, roles: payload.roles };
  }
}
