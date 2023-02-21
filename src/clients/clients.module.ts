import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDTO } from '../shared/dto/clients/client.dto';
import { AuthModule } from 'src/security/auth/auth.module';
import { ClientEntity } from 'src/shared/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
    AuthModule
  ],
  providers: [
    ClientsService, 
    AuthModule
  ],
  exports: [
    ClientsService
  ],
  controllers: [
    ClientsController
  ]
})
export class ClientsModule {}
