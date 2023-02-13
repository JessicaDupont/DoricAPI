import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Tests')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService: ConfigService) {}
  
  @Get('hello')
  getHello(): string {
    return this.appService.getHello(this.configService.get<number>('port'));
  }

  @Get('testAuth')
  getTestAuth(): string {
    return this.appService.getHello(this.configService.get<number>('port'));
  }
}
