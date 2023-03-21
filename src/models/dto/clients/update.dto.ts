import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ClientUpdateDTO extends PickType(
    ClientDTO,
    [
        'clientId',
        'email',
        'name',
        'url'
    ]
){}