export enum ErrorMessage{
    USER_NOT_FOUND = "Utilisateur non trouvé",
    USER_EXIST = "Cet utilisateur est déjà enregistré",
    EMAIL_INVALIDE = "Cette adresse email est invalide",
}

export enum ErrorStatus{
    USER_NOT_FOUND = 404,
    USER_EXIST = 409,
    EMAIL_INVALIDE = 400,
}