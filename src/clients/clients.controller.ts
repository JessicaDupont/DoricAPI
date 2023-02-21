import { Body, Controller, Post, Get, Res, HttpStatus, Req, Request, Param, HttpCode, HttpException } from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/security/auth/auth.service';
import { Crypt } from 'src/security/secureData/crypt';
import { Format } from 'src/security/secureData/format';
import { ClientsService } from './clients.service';
import { ClientDTO } from '../shared/dto/clients/client.dto';
import { CreateClientDTO } from 'src/shared/dto/clients/createClient.dto';
import { ConnectClientDTO } from 'src/shared/dto/clients/connectClient.dto';
import { ErrorMessage, ErrorStatus } from 'src/shared/utilities/error.fr.enum';
import { SuccessMessage, SuccessStatut } from 'src/shared/utilities/success.fr.enum';
import { TokenDTO } from 'src/shared/dto/clients/token.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
    constructor(
        private readonly clientsService: ClientsService,
        private readonly authService: AuthService
    ){}
    
    @Post('inscription')
    @ApiCreatedResponse({status: SuccessStatut.USER_CREATED, description: SuccessMessage.USER_CREATED})
    @ApiResponse({status: ErrorStatus.USER_EXIST, description: ErrorMessage.USER_EXIST})
    @ApiResponse({status: ErrorStatus.EMAIL_INVALIDE, description: ErrorMessage.EMAIL_INVALIDE})
    async inscription(@Body() client:CreateClientDTO){
        console.log("clients.controller.ts/inscription")
        if(Format.validateEmail(client.email)){
            let exist = await this.clientsService.existEmail(client.email)
            if(!exist){
                client.password = await Crypt.securePassword(client.password);
                this.clientsService.create(client);
                throw new HttpException(SuccessMessage.USER_CREATED, SuccessStatut.USER_CREATED)
            }else{
                throw new HttpException(ErrorMessage.USER_EXIST, ErrorStatus.USER_EXIST)
            }
        }else{
            throw new HttpException(ErrorMessage.EMAIL_INVALIDE, ErrorStatus.EMAIL_INVALIDE)
        }
    }

    @Post('connexion')
    @ApiResponse({status: ErrorStatus.USER_NOT_FOUND, description: ErrorMessage.USER_NOT_FOUND})
    @ApiResponse({status: ErrorStatus.EMAIL_INVALIDE, description: ErrorMessage.EMAIL_INVALIDE})
    async connexion(@Body() client:ConnectClientDTO) : Promise<TokenDTO>{
        console.log("clients.controller.ts/connexion")
        let email = client.email;
        let password = client.password;
        if(Format.validateEmail(email)){
            let user : ClientDTO = await this.clientsService.getOneByEmail(email)
            if(Crypt.compare(password, user.password)){
                user.password = "secret";
                await this.clientsService.patchLastConnexion(user);
                let token = await this.authService.login(user);
                return token;
            }else{
                throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
            }
        }else{
            throw new HttpException(ErrorMessage.EMAIL_INVALIDE, ErrorStatus.EMAIL_INVALIDE)
        }
    }
}
