import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/security/auth/auth.module';
import { MailModule } from 'src/shared/mail/mail.module';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserLogEntity } from 'src/models/entities/log.entity';
import { LogsModule } from 'src/middlewares/logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    MailModule,
    LogsModule
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
