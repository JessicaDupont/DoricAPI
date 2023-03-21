import { Injectable } from '@nestjs/common';
import { LogsService } from 'src/middlewares/logs/logs.service';
import { ClientsAllDTO } from 'src/models/dto/clients/all.dto';
import { ClientConnectDTO } from 'src/models/dto/clients/connect.dto';
import { ClientEmailDTO } from 'src/models/dto/clients/email.dto';
import { ClientNameDTO } from 'src/models/dto/clients/name.dto';
import { ClientOneDTO } from 'src/models/dto/clients/one.dto';
import { ClientRegisterDTO } from 'src/models/dto/clients/register.dto';
import { ClientTokenDTO } from 'src/models/dto/clients/token.dto';
import { ClientUpdateDTO } from 'src/models/dto/clients/update.dto';
import { ClientUrlDTO } from 'src/models/dto/clients/url.dto';
import { ClientValidateDTO } from 'src/models/dto/clients/validate.dto';
import { ClientEntity } from 'src/models/entities/client.entity';
import { MailService } from 'src/shared/mail/mail.service';
import { Generators } from 'src/shared/utilities/generators';
import { StatusMethode } from 'src/shared/utilities/languages/bases/logsMessages.interface';
import { UserContentMailFR } from 'src/shared/utilities/languages/fr/userContentMail';

@Injectable()
export class ClientsService {
    constructor(
        private readonly logS: LogsService,
        private readonly mailS: MailService
    ) { }

    private create(client: ClientRegisterDTO) { }
    private readOneById(id: number): ClientEntity { return null; }
    private readOneByEmail(email: string): ClientEntity { return null; }
    private readAll(): ClientEntity[] { return null; }
    private update(client: ClientEntity) { }
    private softDelete(client: ClientEntity) { }

    register(ip: string, client: ClientRegisterDTO) {
        let c: ClientEntity = this.readOneByEmail(client.email)
        if (c && c.deleteAt == null) {//client existe déjà
            return this.logS.addWithException(
                ip,
                "clients/register",
                StatusMethode.ERROR,
                this.logS.httpText.userYetExist(client.email),
                this.logS.httpCode.userYetExist(client.email)
            )
        } else if (c) {//existe mais est désinscrit
            this.logS.addWithException(
                ip,
                "clients/register",
                StatusMethode.INFO,
                this.logS.httpText.userCreated(client.email),
                this.logS.httpCode.userCreated(client.email),
                "{client_id: " + c.clientId + "}"
            )
            c.name = client.name;
            c.url = client.url;
            c.isValidate = false;

            this.update(c);
        } else {//n'existe pas ==> creation
            this.create(client);
            c = this.readOneByEmail(client.email);
        }

        this.mailForValidate(c);//envoi mail

        return this.logS.addWithException(//return success
            ip,
            "clients/register",
            StatusMethode.SUCCESS,
            this.logS.httpText.userCreated(c.email),
            this.logS.httpCode.userCreated(c.email),
            "{client_id: " + c.clientId + "}"
        );
    }
    private mailForValidate(client: ClientEntity) {
        let code = Generators.getNumber(client.clientId, 9999, client.email)
        return this.mailS.sendNoReply(
            client.email,
            "Validation de votre adresse email",
            "Votre code de validation est " + code + ". Veuillez entrer votre email et votre code de valisation dans l'API, section \"clients/validation\".",
            "<p>Votre code de validation est " + code + ".</p><p>Veuillez entrer votre email et votre code de valisation dans l'API, section \"clients/validation\".</p>"
        )
    }
    validate(ip: string, client: ClientValidateDTO) {
        let c: ClientEntity = this.readOneByEmail(client.email)
        if (!c) {//client n'existe pas
            /*return*/ this.logS.addWithException(
                ip,
                "clients/validate",
                StatusMethode.ERROR,
                this.logS.httpText.userNotFound(),
                this.logS.httpCode.userNotFound(),
                "{client_email: " + client.email + "}"
            )
        }
        c.isValidate = true;
        this.update(c);

        this.mailValidateOK(c);//envoi mail

        return this.logS.addWithException(//return success
            ip,
            "clients/validate",
            StatusMethode.SUCCESS,
            this.logS.httpText.userCreated(c.email),
            this.logS.httpCode.userCreated(c.email),
            "{client_id: " + c.clientId + "}"
        );
    }
    private mailValidateOK(client: ClientEntity) {
        return this.mailS.sendNoReply(
            client.email,
            "Votre adresse email est validée",
            "Votre adresse email est validée, vous pouvez obtenir votre clé de connexion via la section \"clients/dorica_api_key\".",
            "<p>Votre adresse email est validée, vous pouvez obtenir votre clé de connexion via la section \"clients/dorica_api_key\".</p>"
        )
    }
    connect(ip: string, client: ClientConnectDTO): ClientTokenDTO {
        let c: ClientEntity = this.readOneByEmail(client.email);
        if(!c){//client n'existe pas
            /*return*/ this.logS.addWithException(
                ip,
                "clients/validate",
                StatusMethode.ERROR,
                this.logS.httpText.userNotFound(),
                this.logS.httpCode.userNotFound(),
                "{client_email: " + client.email + "}"
            )
        }

        c.lastConnexion = new Date();
        this.update(c);

        let token: ClientTokenDTO = null;//TODO token dorica_api_key
        return token;
    }
    getMe(ip: string): ClientOneDTO {
        throw new Error('Method not implemented.');
    }
    getOne(ip: string, clientId: number): ClientOneDTO {
        throw new Error('Method not implemented.');
    }
    getAll(ip: string): ClientsAllDTO {
        throw new Error('Method not implemented.');
    }
    put(ip: string, client: ClientUpdateDTO) {
        throw new Error('Method not implemented.');
    }
    url(ip: string, client: ClientUrlDTO) {
        throw new Error('Method not implemented.');
    }
    name(ip: string, client: ClientNameDTO) {
        throw new Error('Method not implemented.');
    }
    email(ip: string, client: ClientEmailDTO) {
        throw new Error('Method not implemented.');
    }
    delete(ip: string, clientId: number) {
        throw new Error('Method not implemented.');
    }
    deleteMe(ip: string) {
        throw new Error('Method not implemented.');
    }
}
