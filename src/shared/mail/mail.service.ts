import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { DOTENV } from '../dotenv';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    public send(from : string, to : string, subject : string, text : string, html : string) : void {
        console.log("MailService/send");
        this.mailerService.sendMail({
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html
        })
        .then(()=>{console.log("mail envoyé")})
        .catch(()=>{console.log("erreur envoi mail")})
    }
    
    public sendNoReply(to : string, subject : string, text : string, html : string) : void {
        console.log("MailService/sendNoReply");
        this.mailerService.sendMail({
            to: to,
            from: DOTENV.MAIL.NOREPLY.username,
            subject: subject,
            text: text,
            html: html
        })
        .then(()=>{console.log("le mail a bien été envoyé par no-reply")})
        .catch((err)=>{console.log("erreur envoi mail par no-reply", err)})
    }
}
