import { Injectable } from '@nestjs/common';
import { Client } from './models/client.model';
import { CreateClient } from './models/createClient.model';

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