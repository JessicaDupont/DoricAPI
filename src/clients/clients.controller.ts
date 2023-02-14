import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ConnectClient } from './dto/connectClient.dto';
import { CreateClient } from './dto/createClient.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
    constructor(
        private readonly clientsService: ClientsService
    ){}
    
    @Post('inscription')
    inscription(@Body() client:CreateClient){
        return this.clientsService.create(client);
    }

    @Get('connexion')
    connexion(@Body() client:ConnectClient){
        return this.clientsService.getOneByEmailPassword(client.email, client.password);
    }

}
