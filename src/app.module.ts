import { Module } from '@nestjs/common';
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
  ],
  providers: [
    AuthModule 
  ],
})
export class AppModule {}
