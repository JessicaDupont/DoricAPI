import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './security/auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { DB } from './shared/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDTO } from './shared/dto/users/user.dto';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true, 
    //   load: [env]
    // }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB.HOST,
      port: DB.PORT,
      username: DB.USERNAME,
      password: DB.PASSWORD,
      database: DB.NAME,
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
