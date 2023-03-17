import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/models/dto/users/user.dto';
import { JwtStrategy } from './jwt/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}
  
  async login(user: UserDTO) {
    console.log("auth.service.ts/login")
    const payload = { sub: user.userId };
    return {
      dorica_access: this.jwtService.sign(payload),
    };
  }
  getUserId(token: string = null): number {
    console.log("auth.service.ts/getuserid")
    if(token){
      let tok = token.substring(7)//Bearer_ = 7
      let res = this.jwtService.decode(tok)
      // console.log("token decoded: ", res)
      return res.sub;
    }else{
      return JwtStrategy.userId;
    }
  }

}