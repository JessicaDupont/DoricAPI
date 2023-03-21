import { PickType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class ClientNameDTO extends PickType(
    ClientDTO,
    [
        'name'
    ]
){}