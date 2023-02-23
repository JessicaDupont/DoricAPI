import { Injectable } from '@nestjs/common';
import { ClientsService } from '../../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { Crypt } from '../secureData/crypt';
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
}