import { Body, Controller, Delete, Get, Ip, Param, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientsAllDTO } from 'src/models/dto/clients/all.dto';
import { ClientConnectDTO } from 'src/models/dto/clients/connect.dto';
import { ClientEmailDTO } from 'src/models/dto/clients/email.dto';
import { ClientNameDTO } from 'src/models/dto/clients/name.dto';
import { ClientOneDTO } from 'src/models/dto/clients/one.dto';
import { ClientRegisterDTO } from 'src/models/dto/clients/register.dto';
import { ClientTokenDTO } from 'src/models/dto/clients/token.dto';
import { ClientUpdateDTO } from 'src/models/dto/clients/update.dto';
import { ClientUrlDTO } from 'src/models/dto/clients/url.dto';
import { ClientValidateDTO } from 'src/models/dto/clients/validate.dto';
import { JwtAuthGuard } from 'src/security/auth/jwt/jwt-auth.guard';
import { ClientsService } from './_clients.service';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {

    constructor(
        private readonly clientS: ClientsService
    ){}

    @Post('inscription')
    register(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientRegisterDTO
    ){
        return this.clientS.register(ip, client);
    }

    @Post('validation')
    validate(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientValidateDTO
    ){
        return this.clientS.validate(ip, client);
    }

    @Post('dorica_api_key')
    connect(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientConnectDTO
    ): ClientTokenDTO{
        return this.clientS.connect(ip, client);
    }

    @Get('profil')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    getMe(
        @Ip() ip:string
    ): ClientOneDTO{
        return this.clientS.getMe(ip);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    getOne(
        @Ip() ip:string,
        @Param() clientId:number
    ): ClientOneDTO{
        return this.clientS.getOne(ip, clientId);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    getAll(
        @Ip() ip:string
    ): ClientsAllDTO{
        return this.clientS.getAll(ip);
    }

    @Patch('email')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    email(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientEmailDTO
    ){
        return this.clientS.email(ip, client);
    }

    @Patch('name')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    name(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientNameDTO
    ){
        return this.clientS.name(ip, client);
    }

    @Patch('url')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    url(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientUrlDTO
    ){
        return this.clientS.url(ip, client);
    }

    @Put('profil')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    put(
        @Ip() ip:string,
        @Body(ValidationPipe) client:ClientUpdateDTO
    ){
        return this.clientS.put(ip, client);
    }

    @Delete('profil')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    deleteMe(
        @Ip() ip:string,
    ){
        return this.clientS.deleteMe(ip);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_api_key")
    delete(
        @Ip() ip:string,
        @Param() clientId:number
    ){
        return this.clientS.delete(ip, clientId);
    }
}
