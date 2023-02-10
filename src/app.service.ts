import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(port: number): string {
    return 'Hello World!!! Bienvenue sur le port '+port;
  }
}
