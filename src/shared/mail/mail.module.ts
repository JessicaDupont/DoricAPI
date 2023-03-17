import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { DOTENV } from '../dotenv';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            // transport: 'smtps://'+DOTENV.MAIL.NOREPLY.username+":"+DOTENV.MAIL.NOREPLY.password,
            transport: {
                host: DOTENV.MAIL.SMTP.serveur,
                port: DOTENV.MAIL.SMTP.port,
                secure: false,
                auth: {
                  user: DOTENV.MAIL.NOREPLY.username,
                  pass: DOTENV.MAIL.NOREPLY.password
                },
                //ignoreTLS: true,
                requireTLS: true,
                tls: {
                    rejectUnauthorized: false
                }
            },
            defaults:{
                from: '"No Reply" <'+DOTENV.MAIL.NOREPLY.username+'>'
            },
            //preview: true,
            template: {
                dir: process.cwd() + '/template/',
                adapter: new PugAdapter(),
                options: {
                    strict: true
                }
            }
        }),
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
