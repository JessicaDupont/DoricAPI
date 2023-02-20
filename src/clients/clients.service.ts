import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './models/client.model';
import { CreateClient } from './models/createClient.model';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>
  ) {}

  create(client : CreateClient){
    let c = this.clientRepository.create({
      url: client.url,
      name: client.name,
      email: client.email,
      password: client.password
    });
    this.clientRepository.save(c);
    return null;
  }

  async existEmail(email: string) : Promise<boolean> {
    let exist = await this.clientRepository.count({
      where: {
        email: email
      }
    })
    return exist > 0;
  }
  async getOneByEmail(email : string) : Promise<Client>{
    console.log("clients.service.ts/getonebyemail")
    let client = await this.clientRepository.findOne({
      where: {
        email: email
      }
    })
    return client;
  }
  async patchLastConnexion(client: Client){
    console.log("clients.service.ts/patchLastConnexion"+Date())
    let date = new Date()
    let dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    let clientMAJ : Client= {
      clientId: client.clientId,
      lastConnexion: dateString,
      inscription: client.inscription,
      url: client.url,
      name: client.name,
      email: client.email,
      password: client.password
    }
    client = await this.clientRepository.preload(clientMAJ);
    client = await this.clientRepository.save(client);
    return client ? true : false;
  }
}