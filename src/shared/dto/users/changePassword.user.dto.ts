import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserDTO } from "./user.dto";
import { TokenDTO } from "./token.dto";

export class ChangePasswordUserDTO extends PickType(
    UserDTO, 
    [
        'password'
    ]
){}