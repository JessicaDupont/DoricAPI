import { Body, Controller, Post, Headers, Get, Res, HttpStatus, Req, Request, Param, HttpCode, HttpException, ValidationPipe, Patch } from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/shared/dto/users/create.user.dto';
import { ConnexionUserDTO } from 'src/shared/dto/users/connexion.user.dto';
import { ErrorMessage, ErrorStatus } from 'src/shared/utilities/error.fr.enum';
import { SuccessMessage, SuccessStatut } from 'src/shared/utilities/success.fr.enum';
import { TokenDTO } from 'src/shared/dto/users/token.dto';
import { ChangePasswordUserDTO } from 'src/shared/dto/users/changePassword.user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ){}
    
    @Post('inscription')
    @ApiCreatedResponse({status: SuccessStatut.USER_CREATED, description: SuccessMessage.USER_CREATED})
    @ApiResponse({status: ErrorStatus.USER_EXIST, description: ErrorMessage.USER_EXIST})
    @ApiResponse({status: ErrorStatus.EMAIL_INVALIDE, description: ErrorMessage.EMAIL_INVALIDE})
    async inscription(@Body(ValidationPipe) user:CreateUserDTO){
        console.log("users.controller.ts/inscription")
        return this.usersService.inscription(user);
    }

    @Post('connexion')
    @ApiResponse({status: ErrorStatus.USER_NOT_FOUND, description: ErrorMessage.USER_NOT_FOUND})
    @ApiResponse({status: ErrorStatus.EMAIL_INVALIDE, description: ErrorMessage.EMAIL_INVALIDE})
    async connexion(@Body(ValidationPipe) user:ConnexionUserDTO) : Promise<TokenDTO>{
        console.log("users.controller.ts/connexion");
        return this.usersService.connexion(user);
    }

    /**
     * permet à un utilisateur de modifier son password si il est déjà connecté
     * @param password 
     * @returns 
     */
    @Patch('changePassword')
    changePassword(
        @Headers() token : TokenDTO,
        @Body(ValidationPipe) password:ChangePasswordUserDTO
    ){
        console.log("users.controller.ts/changePassword");
        return this.usersService.changePassword(token, password)
    }
}
