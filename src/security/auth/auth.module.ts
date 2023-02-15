import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    ClientsModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions : {expiresIn: '1h'}
    }),
  ],
  providers: [
    AuthService, 
    LocalStrategy
  ]
})
export class AuthModule {}
