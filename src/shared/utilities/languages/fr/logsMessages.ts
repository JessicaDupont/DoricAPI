import { UserEntity } from "src/models/entities/user.entity";
import { ILogsMessages, StatusMethode } from "../bases/logsMessages.interface";

export class LogsMessagesFR implements ILogsMessages {
    private getResult(result:string, status:StatusMethode, message:string=null,  user: UserEntity = null): string{
        switch (status) {
            case StatusMethode.START:
                result = result + " (start)";
                break;
            case StatusMethode.INFO:
                    result = result + " INFO : " + message + " user: " + this.userJSON(user);
                    break;
            case StatusMethode.ERROR:
                result = result + " !ERROR! : " + message + " user: " + this.userJSON(user);
                break;
            case StatusMethode.SUCCESS: 
                result = result + " Success : " + message + " user: " + this.userJSON(user);
                break;
            default:
        }
        return result;
    }
    private userJSON(user: UserEntity=null): string {
        return user == null ? "pas d'information sur l'utilisateur" : "{"
            + "deleteAt: " + user.deleteAt + ","
            + "updateAt: " + user.updateAt + ", "
            + "createdAt: " + user.createdAt + ", "
            + "user_id : " + user.userId + ", "
            + "role: " + user.role + ", "
            + "name: " + user.name + ", "
            + "email: " + user.email + ", "
            + "is_validate: " + user.isValidate + ", "
            + "password: " + user.password + ", "
            + "is_restricted: " + user.isRestricted + ", "
            + "url: " + user.url + ", "
            + "last_connexion: " + user.lastConnexion
            + "}";
    }
    userGet1(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[GET] /users/Get1", status, message, user);
    }
    userRegister(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[POST] /users/inscription", status, message, user);
    }
    userReactivate(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[POST] /users/(re)inscription", status, message, user);
    }
    userValidate(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[POST] /users/validation email", status, message, user);
    }
    userLogIn(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[POST] /users/connexion", status, message, user);
    }
    userNewPassword(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[PATCH] /users/envoi nouveau mot de passe", status, message, user);
    }
    userChangePassword(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[PATCH] /users/modification du mot de passe", status, message, user);
    }
    userDeleted(status: StatusMethode, message: string = null, user: UserEntity = null): string {
        return this.getResult("[POST] /users/désactivation", status, message, user);
    }
    
}