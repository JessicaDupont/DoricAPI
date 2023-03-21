import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { DOTENV } from 'src/shared/dotenv';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: DOTENV.jwt_secret_key
    });
  }

  static "userId": number = null;

  // async validate(payload: any) {
  //   return { userId: payload.sub, username: payload.username };
  // }
  async validate(payload: any) {
    console.log("auth/strategy/jwt.strategy", payload)
    JwtStrategy.userId = payload.sub;
    return { userId: payload.sub }
  }
}