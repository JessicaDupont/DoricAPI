import { Body, Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import { Crypt } from 'src/security/secureData/crypt';
import { Format } from 'src/security/secureData/format';
import { ClientsService } from './clients.service';
import { ConnectClient } from './models/connectClient.model';
import { CreateClient } from './models/createClient.model';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
    constructor(
        private readonly clientsService: ClientsService
    ){}
    
    @Post('inscription')
    @ApiCreatedResponse({status: 201, description: "Le client a bien été enregistré."})
    @ApiResponse({status: 406, description: "Email invalide."})
    @ApiResponse({status: 418, description: "Email déjà enregistré."})
    async inscription(@Body() client:CreateClient, @Res() response){
        if(Format.validateEmail(client.email)){
            let exist = await this.clientsService.existEmail(client.email)
            if(!exist){
                client.password = await Crypt.securePassword(client.password);
                this.clientsService.create(client);
                return response.status(201).send({message: "vous avez bien été enregistré."});
            }else{
                return response.status(418).send({message: "L'adresse email est déjà enregistrée."});
            }
        }else{
            return response.status(406).send({message: "Format d'email invalide"});
        }
    }

    @Get('connexion')
    connexion(@Body() client:ConnectClient, @Res() response){
        if(Format.validateEmail(client.email)){
            return this.clientsService.getOneByEmailPassword(client.email, client.password);
        }else{
            return response.status(406).send({message: "Format d'email invalide"});
        }
    }

}
