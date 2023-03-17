import { IResponsesHttp } from "../bases/responsesHttp.interface";

export class ResponsesHttpFR implements IResponsesHttp{
    errorUnknow(error: any): string {
        return "Une erreur s'est produite : "+error;
    }
    userYetExist(email: string): string {
        return "L'utilisateur avec l'adresse email "+email+" existe déjà."
    }
    userNotFound(): string {
        return "L'utilisateur n'a pas été trouvé."
    }
    userNotAdmin(): string {
        return "Zone réservée aux administrateurs."
    }
    userNotEditor(): string {
        return "Zone réservée au éditeurs et administrateurs."
    }
    userRestricted(): string {
        return "Vous ne pouvez effectuer cette action car votre profil est incorrect. Modifiez votre mot de passe."
    }
    userGhost(email: string): string {
        return "Vous ne pouvez effectuer cette action car votre profil n'est pas validé. Validez votre adresse email grâce au mail reçu sur "+email+"."
    }
    userUnauthorized() {
        return "Vous devez créer un compte utilisateur pour accéder à cette zone."
    }
    userCreated(email: string): string {
        return "L'utilisateur avec le mail "+email+" a bien été créer. Consultez vos emails pour activer votre compte."
    }
    userValidate(email: string): string {
        return "L'adresse email "+email+" a été validée."
    }
    userAuthorized(): string {
        return "Vous pouvez accéder à cette zone."
    }
    userPasswordChanged(): string {
        return "Votre mot de passe à bien été modifié."
    }
    userDeleted(email: string): string {
        return "L'utilisateur avec l'adresse email "+email+" a bien été supprimé."
    }
}