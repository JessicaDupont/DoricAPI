import { LogsService } from "src/middlewares/log/logs.service";
import { UserEntity } from "src/models/entities/user.entity";
import { RoleAccess } from "src/security/auth/roles.auth";
export enum StatusMethode{
    START,
    INFO,
    ERROR,
    SUCCESS
}
export interface ILogsMessages{
    userUnAuthorized(
        message:string,
        user: UserEntity
    ): string;
    userGet1(
        status:StatusMethode, 
        message?:string,
        user?: UserEntity): string;
    userRegister(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
    userReactivate(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
    userValidate(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
    userLogIn(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
    userNewPassword(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
    userChangePassword(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
    userDeleted(
        status:StatusMethode,  
        message?:string,
        user?: UserEntity): string;
}