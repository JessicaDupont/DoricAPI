import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/security/auth/auth.module';
import { UserEntity } from 'src/shared/entities/user.entity';
import { MailModule } from 'src/shared/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    MailModule
  ],
  providers: [
    UsersService, 
    AuthModule
  ],
  exports: [
    UsersService
  ],
  controllers: [
    UsersController
  ]
})
export class UsersModule {}
