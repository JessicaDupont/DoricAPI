import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_SECRET_KEY } from 'src/shared/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY
    });
  }

  // async validate(payload: any) {
  //   console.log("auth/strategy/jwt.strategy", payload)
  //   return { userId: payload.sub, username: payload.username };
  // }
}