export interface IResponsesHttp{
    errorUnknow(error);

    userYetExist(email:string);
    userNotFound();
    userNotAdmin();
    userNotEditor();
    userRestricted();
    userGhost(email:string);
    userUnauthorized();
    userCreated(email:string);
    userValidate(email:string);
    userAuthorized();
    userPasswordChanged();
    userDeleted(email:string);
    
}