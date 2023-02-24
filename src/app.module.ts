import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './security/auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import env from './shared/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDTO } from './shared/dto/users/user.dto';

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
      entities: [__dirname + "/**/*.entity.{ts, js}"],
      autoLoadEntities: true,
      synchronize: true,
      //logging: "all"//affiche les requetes envoyée en DB dans la console
    }),
    AuthModule, 
    UsersModule,
    //JwtModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    AuthModule 
  ],
})
export class AppModule {}
