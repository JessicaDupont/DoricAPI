import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LifeTime } from "./bases/lifeTime.entity";

export enum UserRoleBasic {
    ADMIN = "admin", //peut tout faire
    EDITOR = "editor", //peut tout faire sauf la gestion des utilisateurs
    USER = "user",//peut tout VOIR
}

@Entity({name: "admin_api_users"})
export class UserEntity extends LifeTime{
    @PrimaryGeneratedColumn({
        type: "int",
        name: "user_id"
    })
    userId: number;
    
    @Column({
        type: "enum",
        enum: UserRoleBasic,
        default: UserRoleBasic.USER
    })
    role: UserRoleBasic;

    @Column({
        type: "varchar",
        length: 100
    })
    name: string;
    
    @Column({
        type: "varchar",
        length: 255,
        unique: true
    })
    email: string;

    @Column({
        type: "boolean",
        name: "is_validate",
        default: false
    })
    isValidate: boolean;
    
    @Column({
        type: "varchar",
        length: 255
    })
    password: string;

    @Column({
        type: "boolean",
        name: "is_restricted",
        default: false
    })
    isRestricted: boolean;

    @Column({
        type: "varchar",
        length: 2000,
        nullable: true
    })
    url: string;

    @Column({
        type: "date",
        name: "last_connexion"
    })
    lastConnexion: Date;
}