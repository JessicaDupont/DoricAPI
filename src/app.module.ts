import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './security/auth/auth.module';
import { UsersModule } from './_users/users.module';
import { DOTENV } from './shared/dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './shared/mail/mail.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: ['.env', '/.env', '../.env', '../../.env']
    // }), 
    DatabaseModule,
    AuthModule, 
    UsersModule,
    MailModule,
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
