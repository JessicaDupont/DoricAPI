import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class TokenDTO{
    @IsString()
    dorica_access: string;
}