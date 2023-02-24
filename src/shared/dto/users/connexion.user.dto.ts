import { PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class ConnexionUserDTO extends PickType(
    UserDTO, 
    [
        'email', 
        'password'
    ]
){}