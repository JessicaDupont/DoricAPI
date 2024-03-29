import { HttpException } from "@nestjs/common";
import { LogsService } from "src/middlewares/logs/logs.service";
import { UserEntity, UserRoleBasic } from "src/models/entities/user.entity";
import { ILogsMessages, StatusMethode } from "src/shared/utilities/languages/bases/logsMessages.interface";
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
    static isAuthorized(logS: LogsService, user: UserEntity, accessMin: UserRole): boolean {
        type Role = UserRole | UserRoleBasic;
        const Role = { ...UserRole, ...UserRoleBasic };
        let role: Role = user.role;
        let access: Role = accessMin;
        if (user.isRestricted) { role = UserRole.RESTRICTED; }
        if (!user.isValidate) { role = UserRole.GHOST; }

        const httpText = new ResponsesHttpFactory();
        const httpCode = new StatusHttp();
        switch (access) {
            case UserRole.ADMIN:
                switch (role) {
                    case Role.ADMIN:
                        return true;
                    case Role.RESTRICTED:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userRestricted(),
                            httpCode.userRestricted(),
                            user);
                    case Role.GHOST:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userGhost(user.email),
                            httpCode.userGhost(user.email),
                            user);
                    default:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userNotAdmin(),
                            httpCode.userNotAdmin(),
                            user);
                }
            case UserRole.EDITOR:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                        return true;
                    case Role.RESTRICTED:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userRestricted(),
                            httpCode.userRestricted(),
                            user);
                    case Role.GHOST: logS.addWithException(
                        "RolesAccess/isAuthorized",
                        StatusMethode.ERROR,
                        httpText.userGhost(user.email),
                        httpCode.userGhost(user.email),
                        user);
                    default:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userNotEditor(),
                            httpCode.userNotEditor(),
                            user);
                }
            case UserRole.USER:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                    case Role.USER:
                        return true;
                    case Role.RESTRICTED:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userRestricted(),
                            httpCode.userRestricted(),
                            user);
                    case Role.GHOST: logS.addWithException(
                        "RolesAccess/isAuthorized",
                        StatusMethode.ERROR,
                        httpText.userGhost(user.email),
                        httpCode.userGhost(user.email),
                        user);
                    default:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userUnauthorized(),
                            httpCode.userUnauthorized(),
                            user);
                }
            case UserRole.RESTRICTED:
                switch (role) {
                    case Role.ADMIN:
                    case Role.EDITOR:
                    case Role.USER:
                    case Role.RESTRICTED:
                        return true;
                    case Role.GHOST:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userGhost(user.email),
                            httpCode.userGhost(user.email),
                            user);
                    default:
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userUnauthorized(),
                            httpCode.userUnauthorized(),
                            user);
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
                        logS.addWithException(
                            "RolesAccess/isAuthorized",
                            StatusMethode.ERROR,
                            httpText.userUnauthorized(),
                            httpCode.userUnauthorized(),
                            user);
                }
            default: return true;
        }
    }
}