import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ClientEmailDTO extends PickType(
    ClientDTO,
    [
        'email'
    ]
){}