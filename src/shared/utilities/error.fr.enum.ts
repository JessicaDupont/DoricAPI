export enum ErrorMessage{
    ERROR_UNKNOW = "OLD - Une erreur s'est produite",
    USER_EXIST = "OLD - Cet utilisateur est déjà enregistré",
    USER_NOT_FOUND = "OLD - Utilisateur non trouvé",
    USER_NOT_VALIDATE = "OLD - Profil utilisateur non validé. Veuillez valider votre adresse email.",
    USER_UNAUTHORIZED = "OLD - Vous n'avez pas accès a cette fonctionnalité",
    EMAIL_INVALIDE = "OLD - Cette adresse email est invalide",
    ROLE_ADMIN = "OLD - Vous devez être administrateur pour effectuer cette action.",
    ROLE_EDITOR = "OLD - Vous devez être éditeur pour effectuer cette action.",
    ROLE_USER = "OLD - Vous devez être utilisateur pour effectuer cette action.",
    ROLE_RESTRICTED = "OLD - Votre profil est soumis à des restrictions. Ces restrictions s'appliquent lorsque votre profil doit être mis à jour (exemple: le mot de passe doit être modifié après avoir reçu un nouveau par email)",
    ROLE_GHOST = "OLD - Vous devez validé votre adresse email avant de pouvoir effectuer cette action."
}

export enum ErrorStatus{
    ERROR_UNKNOW = 500,
    USER_EXIST = 409,
    USER_NOT_FOUND = 404,
    USER_NOT_VALIDATE = 401,
    USER_UNAUTHORIZED = 401,
    EMAIL_INVALIDE = 400,
    ROLE_ADMIN = 401,
    ROLE_EDITOR = 401,
    ROLE_USER = 401,
    ROLE_RESTRICTED = 401,
    ROLE_GHOST = 401,
}