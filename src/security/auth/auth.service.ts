import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/shared/dto/users/user.dto';

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
    let res = this.jwtService.decode(token)
    return res.sub;
  }
}