import { IResponsesHttp } from "./bases/responsesHttp.interface";
import { ResponsesHttpFR } from "./fr/responsesHttp";

export class ResponsesHttpFactory implements IResponsesHttp{
    "resHttp":IResponsesHttp = null;

    constructor(lang:string="fr") { 
        switch(lang){
            case "fr" : this.resHttp = new ResponsesHttpFR(); break;
            default : this.resHttp = new ResponsesHttpFR();
        }       
    }
    
    errorUnknow(error: any=null): string {
        return this.resHttp.errorUnknow(error);
    }
    userYetExist(email: string): string {
        return this.resHttp.userYetExist(email);
    }
    userNotFound(): string {
        return this.resHttp.userNotFound();
    }
    userNotAdmin(): string {
        return this.resHttp.userNotAdmin();
    }
    userNotEditor(): string {
        return this.resHttp.userNotEditor();
    }
    userRestricted(): string {
        return this.resHttp.userRestricted();
    }
    userGhost(email: string): string {
        return this.resHttp.userGhost(email);
    }
    userUnauthorized() {
        return this.resHttp.userUnauthorized();
    }
    userCreated(email: string): string {
        return this.resHttp.userCreated(email);
    }
    userValidate(email: string): string {
        return this.resHttp.userValidate(email);
    }
    userAuthorized(): string {
        return this.resHttp.userAuthorized();
    }
    userPasswordChanged(): string {
        return this.resHttp.userPasswordChanged();
    }
    userDeleted(email: string): string {
        return this.resHttp.userDeleted(email);
    }

}