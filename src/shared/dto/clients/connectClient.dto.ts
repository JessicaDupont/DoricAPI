import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ConnectClientDTO extends PickType(
    ClientDTO, 
    [
        'email', 
        'password'
    ]
){}