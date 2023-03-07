import { Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './security/auth/auth.service';
import { JwtAuthGuard } from './security/auth/jwt/jwt-auth.guard';
import { PORT } from './shared/env';

@ApiTags('Tests')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    // private configService: ConfigService,
    //private readonly authService: AuthService
  ) {}
  
  
  //@UseGuards(JwtAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   console.log("app.controller.ts/login", req.body)
  //   let result = this.authService.login(req.body)
  //   console.log(result);
  //   return result;
  // }
  
  @Get()
  getHello(): string {
    return this.appService.getHello(parseInt(PORT, 10));//this.configService.get<number>('port'));
  }
  
  @Get('testAuth')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth()
  getTestAuth(): string {
    return this.appService.getHello(parseInt(PORT, 10));
  }
}
