import { Module } from '@nestjs/common';
import { LogsModule } from 'src/middlewares/logs/logs.module'; 
import { LogsService } from 'src/middlewares/logs/logs.service';
import { MailModule } from 'src/shared/mail/mail.module';
import { ClientsController } from './_clients.controller';
import { ClientsService } from './_clients.service';

@Module({
  imports: [
    LogsModule,
    MailModule
  ],
  controllers: [
    ClientsController
  ],
  providers: [
    ClientsService
  ]
})
export class ClientsModule {}
