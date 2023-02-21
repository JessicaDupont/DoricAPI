import { Injectable } from '@nestjs/common';
import { ClientsService } from '../../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { Crypt } from '../secureData/crypt';
import { ClientDTO } from 'src/shared/dto/clients/client.dto';

@Injectable()
export class AuthService {
  constructor(
    //private usersService: ClientsService, 
    private jwtService: JwtService
  ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   console.log("auth.service.ts/validateuser")
  //   const user = await this.usersService.getOneByEmail(username);
  //   if (Crypt.compare(pass, user.password)) {//si password ok
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
  
  async login(user: ClientDTO) {
    console.log("auth.service.ts/login")
    const payload = { sub: user.clientId };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}