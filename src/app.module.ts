import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config';
import env from './context/env';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, 
    load: [env]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
