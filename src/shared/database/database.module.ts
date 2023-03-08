import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOTENV } from '../dotenv';

@Module({
    imports: [
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
        })
    ]
})
export class DatabaseModule {}
