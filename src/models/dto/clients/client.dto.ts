import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl, Length, MaxLength } from "class-validator";

export class ClientDTO{
    @IsInt()
    @IsDefined()
    @ApiProperty({
        required: false
    })
    clientId: number;

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

    @IsUrl()
    @Length(10, 2000)
    @IsDefined()
    @ApiProperty({
        required: false,
        pattern: "^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/",
        example: "http://www.example.com"
    })
    url: string;
}