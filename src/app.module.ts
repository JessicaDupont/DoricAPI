import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './security/auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { JwtModule } from '@nestjs/jwt';
import env from './context/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients/models/client.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [env]
    }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Client],
      synchronize: true,
    }),
    // AuthModule, 
    ClientsModule,
    // JwtModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
