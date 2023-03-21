import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ClientRegisterDTO extends PickType(
    ClientDTO,
    [
        'email',
        'name',
        'url'
    ]
){}