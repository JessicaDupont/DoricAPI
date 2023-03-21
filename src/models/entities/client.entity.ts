import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LifeTime } from "./bases/lifeTime.entity";

@Entity({name: "clients"})
export class ClientEntity extends LifeTime{
    @PrimaryGeneratedColumn({
        type: "int",
        name: "client_id"
    })
    clientId: number;

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
        length: 2000,
        nullable: true
    })
    url: string;

    @Column({
        type: "date",
        name: "last_connexion"
    })
    lastConnexion: Date;

    // @OneToMany(()=>UserLogEntity, (log)=>log.user)
    // logs : UserLogEntity[]
}