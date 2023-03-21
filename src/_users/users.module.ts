import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/security/auth/auth.module';
import { MailModule } from 'src/shared/mail/mail.module';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserLogEntity } from 'src/models/entities/log.entity';
import { LogsModule } from 'src/middlewares/log/logs.module';
import { LogsMessagesFR } from 'src/shared/utilities/languages/fr/logsMessages';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    MailModule,
    LogsModule
  ],
  providers: [
    UsersService, 
    AuthModule,
    LogsModule
  ],
  exports: [
    UsersService
  ],
  controllers: [
    UsersController
  ]
})
export class UsersModule {}
