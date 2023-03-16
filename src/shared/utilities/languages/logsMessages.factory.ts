import { UserEntity } from "src/models/entities/user.entity";
import { ILogsMessages } from "./bases/logsMessages.interface";
import { LogsMessagesFR } from "./fr/logsMessages";

export class LogsMessagesFactory implements ILogsMessages{
    "logsM":ILogsMessages = null;

    constructor(lang:string="fr") { 
        switch(lang){
            case "fr" : this.logsM = new LogsMessagesFR(); break;
            default : this.logsM = new LogsMessagesFR();
        }       
    }
    userGet1(user: UserEntity): string {
        return this.logsM.userGet1(user);
    }
    userRegister(): string {
        return this.logsM.userRegister();
    }
    userReactivate(old: UserEntity): string {
        return this.logsM.userReactivate(old);
    }
    userValidate(result: boolean): string {
        return this.logsM.userValidate(result);
    }
    userLogIn(): string {
        return this.logsM.userLogIn();
    }
    userLogOut(): string {
        return this.logsM.userLogOut();
    }
    userNewPassword(): string {
        return this.logsM.userChangePassword();
    }
    userChangePassword(): string {
        return this.logsM.userChangePassword();
    }
    userDeleted(): string {
        return "DELETE - "+this.logsM.userDeleted();
    }
}