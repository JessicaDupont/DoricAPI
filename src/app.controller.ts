import { Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './security/auth/auth.service';
import { LocalAuthGuard } from './security/auth/strategy/local-auth-guard';

@ApiTags('Tests')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService//, 
    // private configService: ConfigService,
    // private authService: AuthService
  ) {}
  
  @UseGuards(AuthGuard('local'))//LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log("app.controller.ts/login")
    return req.user;
  }

  @Get()
  getHello(): string {
    let port = process.env.PORT || process.env.PORT_LOCAL;
    return this.appService.getHello(parseInt(port, 10));//this.configService.get<number>('port'));
  }

  @Get('testAuth')
  @ApiBasicAuth()
  getTestAuth(): string {
    let port = process.env.PORT || process.env.PORT_LOCAL;
    return this.appService.getHello(parseInt(port, 10));
  }
}
