import { PickType } from "@nestjs/swagger";
import { Client } from "./client.dto";

export class CreateClient extends PickType(
    Client, 
    [
        'url', 
        'name', 
        'email', 
        'password'
    ]
){}