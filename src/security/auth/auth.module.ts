import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
// import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    //ClientsModule, 
    PassportModule,
    JwtModule.register({
      secret: "-JaNdRgUjXn2r5u8x/A?D(G+KbPeShVmYp3s6v9y$B&E)H@McQfTj",
      signOptions : {expiresIn: '1h'}
    }),
  ],
  providers: [
    AuthService, 
    // LocalStrategy, 
    JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
