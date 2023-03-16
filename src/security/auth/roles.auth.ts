import { HttpException } from "@nestjs/common";
import { UserEntity, UserRoleBasic } from "src/models/entities/user.entity";
import { ResponsesHttpFactory } from "src/shared/utilities/languages/responsesHttp.factory";
import { StatusHttp } from "src/shared/utilities/languages/statusHttp";

export enum UserRole {
    ADMIN = "admin", //peut tout faire
    EDITOR = "editor", //peut tout faire sauf la gestion des utilisateurs
    RESTRICTED = "restricted", //doit changer password ou autre information de son profil
    USER = "user",//peut tout VOIR
    GHOST = "ghost"//doit valider son adresse email
}
export class RoleAccess {
    static isAuthorized(user: UserEntity, accessMin: UserRole): boolean {
        type Role = UserRole | UserRoleBasic;
        const Role = {...UserRole, ...UserRoleBasic};
        let role: Role = user.role;
        let access: Role = accessMin;
        if(user.isRestricted){role = UserRole.RESTRICTED;}
        if(!user.isValidate){role = UserRole.GHOST;}
        console.log("roles.auth.ts/isAuthorized - access : "+access+"/role : "+role)

        const resHttp = new ResponsesHttpFactory();
        const statHttp = new StatusHttp();
        switch (access) {
            case UserRole.ADMIN:
                switch (role) {
                    case Role.ADMIN:
                        return true;
                    case Role.RESTRICTED:
                        throw new HttpException(resHttp.userRestricted(), statHttp.userRestricted())
                    case Role.GHOST:
                        throw new HttpException(resHttp.userGhost(user.email), statHttp.userGhost(user.email))
                    default:
                        throw new HttpException(resHttp.userNotAdmin(), statHttp.userNotAdmin())
                }
            case UserRole.EDITOR:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                        return true;
                    case Role.RESTRICTED:
                        throw new HttpException(resHttp.userRestricted(), statHttp.userRestricted())
                    case Role.GHOST:
                        throw new HttpException(resHttp.userGhost(user.email), statHttp.userGhost(user.email))
                    default:
                        throw new HttpException(resHttp.userNotEditor(), statHttp.userNotEditor())
                }
            case UserRole.USER:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                    case Role.USER:
                        return true;
                    case Role.RESTRICTED:
                        throw new HttpException(resHttp.userRestricted(), statHttp.userRestricted())
                    case Role.GHOST:
                        throw new HttpException(resHttp.userGhost(user.email), statHttp.userGhost(user.email))
                    default:
                        throw new HttpException(resHttp.userUnauthorized(), statHttp.userUnauthorized())
                }
            case UserRole.RESTRICTED:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                    case Role.USER:
                    case Role.RESTRICTED:
                        return true;
                    case Role.GHOST:
                        throw new HttpException(resHttp.userGhost(user.email), statHttp.userGhost(user.email))
                    default:
                        throw new HttpException(resHttp.errorUnknow(), statHttp.errorUnknow())
                }
            case UserRole.GHOST:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                    case Role.USER:
                    case Role.RESTRICTED:
                    case Role.GHOST:
                        return true;
                    default:
                        throw new HttpException(resHttp.errorUnknow(), statHttp.errorUnknow())
                }
            default: return true;
        }
    }
}