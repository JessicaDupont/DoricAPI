import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { IsDefined, IsInt } from "class-validator";
import { UserDTO } from "./user.dto";

export class ValidationUserDTO 
extends PickType(
    UserDTO, 
    [
        'email'
    ]
){
    @IsInt()
    @IsDefined()
    @ApiProperty({
        required: false
    })
    code : number
}