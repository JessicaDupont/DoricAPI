import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsDefined, IsInt, Length } from "class-validator";
import { ClientDTO } from "./client.dto";


export class ClientValidateDTO extends PickType(
    ClientDTO,
    [
        'email'
    ]
){
    @IsInt()
    @IsDefined()
    @Length(4, 6)
    @ApiProperty({
        required: true
    })
    code: number;
}