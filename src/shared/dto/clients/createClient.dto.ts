import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class CreateClientDTO extends PickType(
    ClientDTO, 
    [
        'url', 
        'name', 
        'email', 
        'password'
    ]
){}