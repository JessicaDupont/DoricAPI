import { Injectable } from '@nestjs/common';
import { Client } from './dto/client.dto';
import { CreateClient } from './dto/createClient.dto';

@Injectable()
export class ClientsService {

  create(client : CreateClient){
    console.log("je suis le créateur!!!!!!!")
    return null;
  }

  getOneByEmailPassword(email : string, password: string){
    console.log("je médite...")
    return null;
  }

}