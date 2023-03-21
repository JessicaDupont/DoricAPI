import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ClientUrlDTO extends PickType(
    ClientDTO,
    [
        'url'
    ]
){}