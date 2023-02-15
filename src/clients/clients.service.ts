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
      console.log("je suis le créateur!!!!!!!")
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
  getOneByEmailPassword(email : string, password: string) : Promise<Client>{
    console.log("je médite...")
    return this.clientRepository.findOne({
      where: {
        email: email,
        password: password
      }
    })
  }
}