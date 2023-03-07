import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(port: number): string {
    return "Hello World!!!\n"+'<a href="http://localhost:'+port+'/api">Swagger</a>';
  }
  getText(text: string): string {
    return "Hello World!!! "+text;
  }
}
