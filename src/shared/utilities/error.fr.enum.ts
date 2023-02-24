export enum ErrorMessage{
    ERROR_UNKNOW = "Une erreur s'est produite",
    USER_NOT_FOUND = "Utilisateur non trouvé",
    USER_EXIST = "Cet utilisateur est déjà enregistré",
    USER_UNAUTHORIZED = "Vous n'avez pas accès a cette fonctionnalité",
    EMAIL_INVALIDE = "Cette adresse email est invalide",
}

export enum ErrorStatus{
    ERROR_UNKNOW = 500,
    USER_NOT_FOUND = 404,
    USER_EXIST = 409,
    USER_UNAUTHORIZED = 401,
    EMAIL_INVALIDE = 400,
}