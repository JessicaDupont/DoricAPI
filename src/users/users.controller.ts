import { Controller, 
    UseGuards, 
    Post, Get, Patch, Put, Delete, 
    Body, Headers, ValidationPipe, 
    NotImplementedException} from '@nestjs/common';
import { ApiBasicAuth, ApiCreatedResponse, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/shared/dto/users/create.user.dto';
import { ConnexionUserDTO } from 'src/shared/dto/users/connexion.user.dto';
import { ErrorMessage, ErrorStatus } from 'src/shared/utilities/error.fr.enum';
import { SuccessMessage, SuccessStatut } from 'src/shared/utilities/success.fr.enum';
import { TokenDTO } from 'src/shared/dto/users/token.dto';
import { ChangePasswordUserDTO } from 'src/shared/dto/users/changePassword.user.dto';
import { JwtAuthGuard } from 'src/security/auth/jwt/jwt-auth.guard';
import { NewPasswordUserDTO } from 'src/shared/dto/users/newPassword.user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ){}

    @Post('inscription')
    create(
        @Body(ValidationPipe) user:CreateUserDTO
    ){
        console.log("users.controller.ts/create")
        return this.usersService.inscription(user);
    }

    @Post('connexion')
    connect(
        @Body(ValidationPipe) user:ConnexionUserDTO
    ) : Promise<TokenDTO>{
        console.log("users.controller.ts/connect");
        return this.usersService.connexion(user);
    }

    
    @Get('profil') 
    @UseGuards(JwtAuthGuard) @ApiBasicAuth()
    get1(
        @Headers() token : TokenDTO
    ){
        console.log("users.controller.ts/get1");
        throw new NotImplementedException();
    }

    @Get() 
    @UseGuards(JwtAuthGuard) @ApiBasicAuth()
    getAll(
        @Headers() token : TokenDTO
    ){
        console.log("users.controller.ts/getAll");
        throw new NotImplementedException();
    }

    @Put() 
    @UseGuards(JwtAuthGuard) @ApiBasicAuth()
    update(){
        console.log("users.controller.ts/update");
        throw new NotImplementedException();
    }

    @Patch('newPassword') @ApiOperation({summary: "envoi un nouveau password par email"})
    newPassword(
        @Body(ValidationPipe) user:NewPasswordUserDTO
    ){
        console.log("users.controller.ts/newPassword");
        throw new NotImplementedException();
    }

    @Patch('changePassword') @ApiOperation({summary: "permet à l'utilisateur connecté de choisir un nouveau password"})
    @UseGuards(JwtAuthGuard) @ApiBasicAuth()
    patchPassword(
        @Headers() token : TokenDTO,
        @Body(ValidationPipe) password:ChangePasswordUserDTO
    ){
        console.log("users.controller.ts/patchPassword");
        return this.usersService.changePassword(token, password)
    }

    @Delete() 
    @UseGuards(JwtAuthGuard) @ApiBasicAuth()
    delete(
        @Headers() token : TokenDTO
    ){
        console.log("users.controller.ts/delete");
        throw new NotImplementedException();
    }
}
