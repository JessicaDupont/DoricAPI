import { IResponsesHttp } from "./bases/responsesHttp.interface";

export class StatusHttp implements IResponsesHttp{
    errorUnknow(error: any=null) { return 500; }
    
    userYetExist(email: string) { return 409; }
    userNotFound() { return 404; }
    userNotAdmin() { return 403; }
    userNotEditor() { return 403; }
    userRestricted() { return 403; }
    userGhost(email: string) { return 403; }
    userUnauthorized() { return 401; }
    userCreated(email: string) { return 201; }
    userValidate(email: string) { return 200; }
    userAuthorized() { return 200; }
    userPasswordChanged() { return 200; }
    userDeleted(email: string) { return 200; }
}