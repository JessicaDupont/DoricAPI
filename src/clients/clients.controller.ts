import { Body, Controller, Post, Get, Res, HttpStatus, Req, Request, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Crypt } from 'src/security/secureData/crypt';
import { Format } from 'src/security/secureData/format';
import { ClientsService } from './clients.service';
import { Client } from './models/client.model';
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
    async inscription(@Body() client:CreateClient, @Res() res:Response){
        console.log("clients.controller.ts/inscription")
        if(Format.validateEmail(client.email)){
            let exist = await this.clientsService.existEmail(client.email)
            if(!exist){
                client.password = await Crypt.securePassword(client.password);
                this.clientsService.create(client);
                return res.status(201).send({message: "vous avez bien été enregistré."});
            }else{
                return res.status(418).send({message: "L'adresse email est déjà enregistrée."});
            }
        }else{
            return res.status(406).send({message: "Format d'email invalide"});
        }
    }

    @Post('connexion')
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Cette adresse email n'est pas enregistrée"})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: "Format d'email invalide"})
    async connexion(@Body() client:ConnectClient, @Res() res:Response){
        console.log("clients.controller.ts/connexion")
        let email = client.email;
        let password = client.password;
        if(Format.validateEmail(email)){
            let user : Client = await this.clientsService.getOneByEmail(email)
            if(Crypt.compare(password, user.password)){
                await this.clientsService.patchLastConnexion(user);
                user.password = "secret";
                return res.status(HttpStatus.ACCEPTED).json(user);
            }else{
                return res.status(HttpStatus.NOT_FOUND).send({message: "Email inconnu"});
            }
        }else{
            return res.status(HttpStatus.NOT_ACCEPTABLE).send({message: "Format d'email invalide"});
        }
    }
}
