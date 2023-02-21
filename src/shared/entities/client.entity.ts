import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "admin_api_clients"})
export class ClientEntity{
    @PrimaryGeneratedColumn({
        type: "int",
        name: "client_id"
    })
    clientId: number;

    @CreateDateColumn()
    inscription: string;
    
    @Column({
        type: "date",
        name: "last_connexion"
    })
    lastConnexion: string;
    
    @Column({
        type: "varchar",
        length: 250,
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