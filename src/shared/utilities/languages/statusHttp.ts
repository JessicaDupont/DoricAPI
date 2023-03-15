import { IResponsesHttp } from "./bases/responsesHttp.interface";

export class StatusHttp implements IResponsesHttp{
    errorUnknow(error: any=null) { return 500; }
    
    userYetExist(email: string) { return 409; }
    userNotFound() { return 404; }
    userNotAdmin() { return 401; }
    userNotEditor() { return 401; }
    userRestricted() { return 401; }
    userGhost(email: string) { return 401; }
    userUnauthorized() { return 401; }
    userCreated(email: string) { return 201; }
    userValidate(email: string) { return 200; }
    userAuthorized() { return 200; }
    userPasswordChanged() { return 200; }
    userDeleted(email: string) { return 200; }
}