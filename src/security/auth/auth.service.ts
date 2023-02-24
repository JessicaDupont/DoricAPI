import { Injectable } from '@nestjs/common';
import { ClientsService } from '../../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { ClientDTO } from 'src/shared/dto/clients/client.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}
  
  async login(user: ClientDTO) {
    console.log("auth.service.ts/login")
    const payload = { sub: user.clientId };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  getClientId(token: string): number {
    console.log("auth.service.ts/getclientid")
    let res = this.jwtService.decode(token)
    return res.sub;
  }
}