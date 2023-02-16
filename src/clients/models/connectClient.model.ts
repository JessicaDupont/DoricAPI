import { PickType } from "@nestjs/swagger";
import { Client } from "./client.model";

export class ConnectClient extends PickType(
    Client, 
    [
        'email', 
        'password'
    ]
){}