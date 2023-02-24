import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/security/auth/auth.module';
import { UserEntity } from 'src/shared/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
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
