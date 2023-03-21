import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogEntity } from 'src/models/entities/log.entity';
import { LogsMessagesFR } from 'src/shared/utilities/languages/fr/logsMessages';
import { LogsService } from './logs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserLogEntity]),
    ],
    providers: [
        LogsService,
        {
            provide: 'ILogsMessages',
            useFactory: () => {
                const lang = 'fr';//TODO récupérer langue de l'utilisateur
                switch (lang) {
                    case "fr": return new LogsMessagesFR();
                    default: return new LogsMessagesFR();
                }
            }
        }
    ],
    exports: [
        LogsService,
        'ILogsMessages'
    ]
})
export class LogsModule { }
