import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/security/auth/auth.service';
import { Crypt } from 'src/security/secureData/crypt';
import { ConnectClientDTO } from 'src/shared/dto/clients/connectClient.dto';
import { CreateClientDTO } from 'src/shared/dto/clients/createClient.dto';
import { TokenDTO } from 'src/shared/dto/clients/token.dto';
import { ClientEntity } from 'src/shared/entities/client.entity';
import { ErrorMessage, ErrorStatus } from 'src/shared/utilities/error.fr.enum';
import { SuccessMessage, SuccessStatut } from 'src/shared/utilities/success.fr.enum';
import { Repository } from 'typeorm';
import { ClientDTO } from '../shared/dto/clients/client.dto';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(ClientEntity) private clientRepo: Repository<ClientEntity>,
    private readonly authService: AuthService
  ) {}

  async inscription(client : CreateClientDTO){
    console.log("clients.service.ts/create");
    if(await this.existEmail(client.email)){
      throw new HttpException(ErrorMessage.USER_EXIST, ErrorStatus.USER_EXIST)
    }

    client.password = await Crypt.securePassword(client.password);
    let c = this.clientRepo.create(client);

    this.clientRepo.save(c)
    .catch(_ => {
      throw new HttpException(ErrorMessage.ERROR_UNKNOW, ErrorStatus.ERROR_UNKNOW)
    })
    return {
      statusCode : SuccessStatut.USER_CREATED,
      message : SuccessMessage.USER_CREATED
    }
  }
  async connexion(client : ConnectClientDTO) : Promise<TokenDTO>{
    console.log("clients.service.ts/connexion");
    if(!(await this.existEmail(client.email))){
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    }

    let user : ClientEntity = await this.getOneByEmail(client.email)
    if(Crypt.compare(client.password, user.password)){
        await this.patchLastConnexion(user);
        let token : TokenDTO = await this.authService.login(user);
        return token;
    }else{
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    }
  }
  
  private async existEmail(email: string) : Promise<boolean> {
    let exist = await this.clientRepo.count({
      where: {
        email: email
      }
    })
    return exist > 0;
  }
  private async getOneByEmail(email : string) : Promise<ClientEntity>{
    console.log("clients.service.ts/getonebyemail")
    return this.clientRepo.findOneOrFail({
      where: {
        email: email
      }
    })
    .catch((error) => {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    })
  }
  private async patchLastConnexion(client: ClientDTO){
    console.log("clients.service.ts/patchLastConnexion")
    let date = new Date()
    client.lastConnexion = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;;

    await this.clientRepo.save(client)
    .catch(_ => {
      return false;
    })
    return true; 
  }
}