import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DOTENV } from 'src/shared/dotenv';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: DOTENV.jwt_secret_key,
      signOptions : {expiresIn: '1h'}
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
