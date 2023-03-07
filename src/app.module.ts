import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './security/auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { DOTENV } from './shared/dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDTO } from './shared/dto/users/user.dto';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailModule } from './shared/mail/mail.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: ['.env', '/.env', '../.env', '../../.env']
    // }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DOTENV.DB.host,
      port: DOTENV.DB.port,
      username: DOTENV.DB.username,
      password: DOTENV.DB.password,
      database: DOTENV.DB.name,
      entities: [__dirname + "/**/*.entity.{ts, js}"],
      autoLoadEntities: true,
      synchronize: true,
      //logging: "all"//affiche les requetes envoyée en DB dans la console
    }),
    AuthModule, 
    UsersModule,
    MailModule
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
