import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ClientConnectDTO extends PickType(
    ClientDTO,
    [
        'email'
    ]
){}