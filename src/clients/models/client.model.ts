import {ApiProperty, PartialType } from "@nestjs/swagger";

export class Client{
    @ApiProperty({required: false})
    client_id: number;

    @ApiProperty({required: false})
    inscription: string;

    @ApiProperty({required: false})
    last_connexion: string;

    @ApiProperty({required: false})
    url: string;

    @ApiProperty({required: false})
    name: string;

    @ApiProperty({required: true})
    email: string;

    @ApiProperty({required: true})
    password: string;
}