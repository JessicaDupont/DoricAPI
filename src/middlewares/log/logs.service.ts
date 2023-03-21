import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogEntity } from 'src/models/entities/log.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { StatusMethode } from 'src/shared/utilities/languages/bases/logsMessages.interface';
import { ResponsesHttpFactory } from 'src/shared/utilities/languages/responsesHttp.factory';
import { StatusHttp } from 'src/shared/utilities/languages/statusHttp';
import { UsersService } from 'src/_users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
    httpText: ResponsesHttpFactory = new ResponsesHttpFactory();
    httpCode: StatusHttp = new StatusHttp();
    constructor(
        @InjectRepository(UserLogEntity) private logsRepo: Repository<UserLogEntity>
    ) { }

    private async add(ip:string, message: string, infos:string) {
        let log = await this.logsRepo.create({
            message: message,
            info: infos,
            ip: ip
        })
        console.log("***LOG***: \n", log);
        await this.logsRepo.save(log)
            .catch(e => {
                throw new HttpException(this.httpText.errorUnknow(e), this.httpCode.errorUnknow(e))
            })
    }
    async addWithException(
        ip:string,
        methode: string,
        status: StatusMethode,
        text: string = null,
        code: number = null,
        info: string = null
    ) {
        let message = this.getMessage(methode, status, text, info)
        console.log("---LOG---\n" + message + " : " + code);
        switch (status) {
            case StatusMethode.START: 
            case StatusMethode.INFO:
                await this.add(ip, message, info);
                break;
            case StatusMethode.ERROR:
                await this.add(ip, message, info);
                throw new HttpException(text, code);
            case StatusMethode.SUCCESS:
                await this.add(ip, message, info);
                return { statusCode: code, message: text };
        }
    }

    private getMessage(result: string, status: StatusMethode, message: string = null, info: string = null): string {
        switch (status) {
            case StatusMethode.START:
                result = result + " -start-";
                break;
            case StatusMethode.INFO:
                result = result + " ?INFO? : " + message + " user: " + info;
                break;
            case StatusMethode.ERROR:
                result = result + " !ERROR! : " + message + " user: " + info;
                break;
            case StatusMethode.SUCCESS:
                result = result + " *Success* : " + message + " user: " + info;
                break;
            default:
        }
        return result;
    }
}
