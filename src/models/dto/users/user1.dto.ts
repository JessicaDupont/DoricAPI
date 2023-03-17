import { OmitType, PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class User1DTO 
// extends PickType(
extends OmitType(
    UserDTO, 
    [
//         'createdAt',
        'updateAt',
        'deleteAt',
//         'userId',
//         'name', 
//         'email',
        'password',
//         'url', 
//         'lastConnexion'
    ]
){}