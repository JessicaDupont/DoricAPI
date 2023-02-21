import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDTO } from 'src/shared/dto/clients/createClient.dto';
import { ClientEntity } from 'src/shared/entities/client.entity';
import { Repository } from 'typeorm';
import { ClientDTO } from '../shared/dto/clients/client.dto';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(ClientEntity) private clientRepo: Repository<ClientEntity>
  ) {}

  create(client : CreateClientDTO){
    let c = this.clientRepo.create({
      url: client.url,
      name: client.name,
      email: client.email,
      password: client.password
    });
    this.clientRepo.save(c);
    return null;
  }

  async existEmail(email: string) : Promise<boolean> {
    let exist = await this.clientRepo.count({
      where: {
        email: email
      }
    })
    return exist > 0;
  }
  async getOneByEmail(email : string) : Promise<ClientDTO>{
    console.log("clients.service.ts/getonebyemail")
    let client = await this.clientRepo.findOne({
      where: {
        email: email
      }
    })
    return client;
  }
  async patchLastConnexion(client: ClientDTO){
    console.log("clients.service.ts/patchLastConnexion")
    let date = new Date()
    let dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    let clientMAJ : ClientDTO= {
      clientId: client.clientId,
      lastConnexion: dateString,
      inscription: client.inscription,
      url: client.url,
      name: client.name,
      email: client.email,
      password: client.password
    }
    client = await this.clientRepo.preload(clientMAJ);
    client = await this.clientRepo.save(client);
    return client ? true : false;
  }
}