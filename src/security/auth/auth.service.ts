import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/models/dto/users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}
  
  async login(user: UserDTO) {
    console.log("auth.service.ts/login")
    const payload = { sub: user.userId };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  getUserId(token: string): number {
    console.log("auth.service.ts/getuserid")
    let tok = token.substring(7)//Bearer_ = 7
    let res = this.jwtService.decode(tok)
    // console.log("token decoded: ", res)
    return res.sub;
  }

}