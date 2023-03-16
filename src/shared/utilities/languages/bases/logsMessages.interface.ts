import { UserEntity } from "src/models/entities/user.entity";

export interface ILogsMessages{
    userGet1(user: UserEntity): string;
    userRegister(): string;
    userReactivate(old:UserEntity): string;
    userValidate(result:boolean): string;
    userLogIn(): string;
    userLogOut(): string;
    userNewPassword(): string;
    userChangePassword(): string;
    userDeleted(): string;
}