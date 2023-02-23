import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LifeTime } from "./bases/lifeTime.entity";

@Entity({name: "admin_api_clients"})
export class ClientEntity extends LifeTime{
    @PrimaryGeneratedColumn({
        type: "int",
        name: "client_id"
    })
    clientId: number;
    
    @Column({
        type: "date",
        name: "last_connexion"
    })
    lastConnexion: string;
    
    @Column({
        type: "varchar",
        length: 2000,
        nullable: true
    })
    url: string;
    
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
        type: "varchar",
        length: 255
    })
    password: string;
}