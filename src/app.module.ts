import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './security/auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { JwtModule } from '@nestjs/jwt';
import env from './context/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [env]
    }), 
    // AuthModule, 
    ClientsModule,
    // JwtModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
