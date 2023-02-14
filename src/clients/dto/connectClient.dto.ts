import { PickType } from "@nestjs/swagger";
import { Client } from "./client.dto";

export class ConnectClient extends PickType(
    Client, 
    [
        'email', 
        'password'
    ]
){}