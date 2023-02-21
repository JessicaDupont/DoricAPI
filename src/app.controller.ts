import { Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './security/auth/auth.service';
import { JwtAuthGuard } from './security/auth/authGuard/jwt-auth.guard';

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
    let port = process.env.PORT || process.env.PORT_LOCAL;
    return this.appService.getHello(parseInt(port, 10));//this.configService.get<number>('port'));
  }
  
  @Get('testAuth')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth()
  getTestAuth(): string {
    let port = process.env.PORT || process.env.PORT_LOCAL;
    return this.appService.getHello(parseInt(port, 10));
  }
}
