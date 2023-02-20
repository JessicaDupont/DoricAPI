import { Injectable } from '@nestjs/common';
import { ClientsService } from '../../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { Crypt } from '../secureData/crypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: ClientsService, 
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log("auth.service.ts/validateuser")
    const user = await this.usersService.getOneByEmail(username);
    if (Crypt.compare(pass, user.password)) {//si password ok
      //const { password, ...result } = user;
      return user;
    }
    return null;
  }
  
  async login(user: any) {
    console.log("auth.service.ts/login")
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}