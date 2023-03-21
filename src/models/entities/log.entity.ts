import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: "logs"})
export class UserLogEntity{
    @PrimaryGeneratedColumn({
        type:"int", 
        name:"log_id"
    })
    logId: number;

    @CreateDateColumn()
    createdAt: Date;

    // @ManyToOne(()=> UserEntity, (user)=> user.logs)
    // user : UserEntity;

    @Column({
        type:"varchar",
        length: 1000,
        nullable: true
    })
    info: string;

    @Column({
        type:"varchar",
        length: 32,
        nullable: false
    })
    ip:string;

    @Column({
        type:"varchar",
        length: 1000,
        nullable: false
    })
    message : string;
}

