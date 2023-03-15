import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDefined, IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, IsUrl, Length, MaxLength, MinLength, minLength } from "class-validator";

export class UserDTO{
    @IsInt()
    @IsDefined()
    @ApiProperty({
        required: false
    })
    userId: number;
    
    @IsDate()
    @ApiProperty({
        required: false,
        format: "date"
    })
    lastConnexion: Date;
    
    @IsUrl()
    @Length(10, 2000)
    @IsDefined()
    @ApiProperty({
        required: false,
        pattern: "^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/",
        example: "http://www.example.com"
    })
    url: string;
    
    @IsString()
    @MaxLength(100)
    @ApiProperty({
        required: false
    })
    name: string;
    
    @IsEmail()
    @Length(5, 255)
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        format: "email",
        pattern: "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
    })
    email: string;
    
    @IsNotEmpty()
    @IsDefined()
    @IsStrongPassword({
        minLength : 8,
        minLowercase : 1,
        minUppercase : 1,
        minNumbers : 1,
        minSymbols : 1
    })
    @ApiProperty({
        required: true,
        example: "123stringSTRING/*-"
    })
    password: string;

    @IsDate()
    @ApiProperty({
        required: false,
        format: "date"
    })
    deleteAt : Date

    @IsDate()
    @ApiProperty({
        required: false,
        format: "date"
    })
    updateAt : Date

    @IsDate()
    @ApiProperty({
        required: false,
        format: "date"
    })
    createdAt : Date
}