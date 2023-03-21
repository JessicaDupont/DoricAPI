import { IsString } from "class-validator";

export class ClientTokenDTO{
    @IsString()
    dorica_api_key: string;
}