import { CreateUserDTO } from "../dto/users/create.user.dto";
import { User1DTO } from "../dto/users/user1.dto";
import { UserEntity } from "../entities/user.entity";

export class UserMapper{
    static toUser1DTO(entity : UserEntity) : User1DTO {
        let result : User1DTO = {
            "userId" : entity.userId,
            "name" : entity.name,
            "email" : entity.email,
            "url" : entity.url,
            "createdAt" : entity.createdAt,
            "lastConnexion" : entity.lastConnexion
        }
        return result
    }
}