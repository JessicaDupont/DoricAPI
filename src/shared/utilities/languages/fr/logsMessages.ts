import { UserEntity } from "src/models/entities/user.entity";
import { ILogsMessages } from "../bases/logsMessages.interface";

export class LogsMessagesFR implements ILogsMessages{
    userGet1(user: UserEntity): string {
        return "Consultation du profil #"+user.userId+" de "+user.email;
    }
    userRegister(): string {
        return "Inscription";
    }
    userReactivate(old: UserEntity): string {
        let infos = "{"
            +"deleteAt: "+old.deleteAt+","
            +"updateAt: "+old.updateAt+", "
            +"createdAt: "+old.createdAt+", "
            +"user_id : "+old.userId+", "
            +"role: "+old.role+", "
            +"name: "+old.name+", "
            +"email: "+old.email+", "
            +"is_validate: "+old.isValidate+", "
            +"password: "+old.password+", "
            +"is_restricted: "+old.isRestricted+", "
            +"url: "+old.url+", "
            +"last_connexion: "+old.lastConnexion
        +"}"
        return "Réactivation adresse email : "+old.email+". Previous infos: "+infos
    }
    userValidate(result:boolean): string {
        return result ? "Email validé" : "Échec de la validation d'email"
    }
    userLogIn(): string {
        return "Connexion"
    }
    userLogOut(): string {
        return "Déconnexion"
    }
    userNewPassword(): string {
        return "Envoi d'un nouveau mot de passe"
    }
    userChangePassword(): string {
        return "Modification du mot de passe"
    }
    userDeleted(): string {
        return "Suppression du compte"
    }
}