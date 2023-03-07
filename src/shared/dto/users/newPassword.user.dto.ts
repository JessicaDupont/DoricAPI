import { PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class NewPasswordUserDTO extends PickType(
    UserDTO, 
    [
        'email'
    ]
){}