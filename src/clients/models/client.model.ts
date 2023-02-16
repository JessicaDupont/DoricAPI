import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "admin_api_clients"})
export class Client{
    @IsInt()
    @PrimaryGeneratedColumn({
        type: "int",
        name: "client_id"
    })
    @ApiProperty({
        required: false
    })
    clientId: number;

    @IsDate()
    @CreateDateColumn()
    @ApiProperty({
        required: false,
        format: "date"
    })
    inscription: string;
    
    @IsDate()
    @Column({
        type: "date",
        name: "last_connexion"
    })
    @ApiProperty({
        required: false,
        format: "date"
    })
    lastConnexion: string;
    
    @IsUrl()
    @Column({
        type: "varchar",
        length: 250,
        nullable: true
    })
    @ApiProperty({
        required: false,
        pattern: "^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/",
        example: "http://www.example.com"
    })
    url: string;
    
    @IsString()
    @Column({
        type: "varchar",
        length: 100
    })
    @ApiProperty({
        required: false
    })
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    @Column({
        type: "varchar",
        length: 255,
        unique: true
    })
    @ApiProperty({
        required: true,
        format: "email",
        pattern: "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
    })
    email: string;
    
    @IsNotEmpty()
    @Column({
        type: "varchar",
        length: 255
    })
    @ApiProperty({
        required: true
    })
    password: string;
}