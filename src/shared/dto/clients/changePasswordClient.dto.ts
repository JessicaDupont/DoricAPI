import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ClientDTO } from "./client.dto";
import { TokenDTO } from "./token.dto";

export class ChangePasswordClientDTO extends IntersectionType(
    PickType(ClientDTO, ['password']),
){}