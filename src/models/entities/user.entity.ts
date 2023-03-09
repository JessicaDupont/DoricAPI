import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LifeTime } from "./bases/lifeTime.entity";

@Entity({name: "admin_api_users"})
export class UserEntity extends LifeTime{
    @PrimaryGeneratedColumn({
        type: "int",
        name: "user_id"
    })
    userId: number;
    
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
        name: "validation_email",
        default: false
    })
    validationEmail: boolean;
    
    @Column({
        type: "varchar",
        length: 255
    })
    password: string;

    @Column({
        type: "boolean",
        name: "new_password",
        default: true
    })
    newPassword: boolean;

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
    lastConnexion: string;
}