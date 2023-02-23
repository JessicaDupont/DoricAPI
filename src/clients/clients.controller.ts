import { Body, Controller, Post, Get, Res, HttpStatus, Req, Request, Param, HttpCode, HttpException, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDTO } from 'src/shared/dto/clients/createClient.dto';
import { ConnectClientDTO } from 'src/shared/dto/clients/connectClient.dto';
import { ErrorMessage, ErrorStatus } from 'src/shared/utilities/error.fr.enum';
import { SuccessMessage, SuccessStatut } from 'src/shared/utilities/success.fr.enum';
import { TokenDTO } from 'src/shared/dto/clients/token.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
    constructor(
        private readonly clientsService: ClientsService
    ){}
    
    @Post('inscription')
    @ApiCreatedResponse({status: SuccessStatut.USER_CREATED, description: SuccessMessage.USER_CREATED})
    @ApiResponse({status: ErrorStatus.USER_EXIST, description: ErrorMessage.USER_EXIST})
    @ApiResponse({status: ErrorStatus.EMAIL_INVALIDE, description: ErrorMessage.EMAIL_INVALIDE})
    async inscription(@Body(ValidationPipe) client:CreateClientDTO){
        console.log("clients.controller.ts/inscription")
        return this.clientsService.inscription(client);
    }

    @Post('connexion')
    @ApiResponse({status: ErrorStatus.USER_NOT_FOUND, description: ErrorMessage.USER_NOT_FOUND})
    @ApiResponse({status: ErrorStatus.EMAIL_INVALIDE, description: ErrorMessage.EMAIL_INVALIDE})
    async connexion(@Body(ValidationPipe) client:ConnectClientDTO) : Promise<TokenDTO>{
        console.log("clients.controller.ts/connexion");
        return this.clientsService.connexion(client);
    }
}
