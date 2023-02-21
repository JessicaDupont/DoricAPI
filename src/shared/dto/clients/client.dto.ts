import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class ClientDTO{
    @IsInt()
    @ApiProperty({
        required: false
    })
    clientId: number;

    @IsDate()
    @ApiProperty({
        required: false,
        format: "date"
    })
    inscription: string;
    
    @IsDate()
    @ApiProperty({
        required: false,
        format: "date"
    })
    lastConnexion: string;
    
    @IsUrl()
    @ApiProperty({
        required: false,
        pattern: "^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/",
        example: "http://www.example.com"
    })
    url: string;
    
    @IsString()
    @ApiProperty({
        required: false
    })
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        format: "email",
        pattern: "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
    })
    email: string;
    
    @IsNotEmpty()
    @ApiProperty({
        required: true
    })
    password: string;
}