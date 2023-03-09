import { Controller, 
    UseGuards, 
    Post, Get, Patch, Put, Delete, 
    Body, Headers, ValidationPipe, 
    NotImplementedException} from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/models/dto/users/create.user.dto';
import { ConnexionUserDTO } from 'src/models/dto/users/connexion.user.dto';
import { ChangePasswordUserDTO } from 'src/models/dto/users/changePassword.user.dto';
import { JwtAuthGuard } from 'src/security/auth/jwt/jwt-auth.guard';
import { NewPasswordUserDTO } from 'src/models/dto/users/newPassword.user.dto';
import { TokenDTO } from 'src/models/dto/users/token.dto';
import { User1DTO } from 'src/models/dto/users/user1.dto';
import { ValidationUserDTO } from 'src/models/dto/users/validation.user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ){}

    @Post('inscription') @ApiOperation({summary: "inscription en vue d'utiliser l'API"})
    create(
        @Body(ValidationPipe) user:CreateUserDTO
    ){
        console.log("users.controller.ts/create")
        return this.usersService.inscription(user);
    }

    @Post('ValidationEmail') @ApiOperation({summary: "Validez votre adresse mail grâce au code reçu"})
    validateEmail(
        @Body(ValidationPipe) user : ValidationUserDTO
    ){
        console.log("users.controller.ts/validationEmail");
        return this.usersService.validationEmail(user);
    }

    @Post('connexion') @ApiOperation({summary: "connexion à l'API pour recevoir un token"})
    connect(
        @Body(ValidationPipe) user:ConnexionUserDTO
    ) : Promise<TokenDTO>{
        console.log("users.controller.ts/connect");
        return this.usersService.connexion(user);
    }

    
    @Get('profil') @ApiOperation({summary: "voir votre profil utilisateur"})
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    async get1() : Promise<User1DTO>{
        console.log("users.controller.ts/get1");
        return await this.usersService.get1();
    }

    @Get() 
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    getAll(){
        console.log("users.controller.ts/getAll");
        throw new NotImplementedException();
    }

    @Put() 
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    update(){
        console.log("users.controller.ts/update");
        throw new NotImplementedException();
    }

    @Patch('newPassword') @ApiOperation({summary: "envoi un nouveau password par email"})
    newPassword(
        @Body(ValidationPipe) user:NewPasswordUserDTO
    ){
        console.log("users.controller.ts/newPassword");
        return this.usersService.newPassword(user)
    }

    @Patch('changePassword') @ApiOperation({summary: "permet à l'utilisateur connecté de choisir un nouveau password"})
    @UseGuards(JwtAuthGuard) @ApiBearerAuth("dorica_access")
    changePassword(
        @Body(ValidationPipe) password:ChangePasswordUserDTO
    ){
        console.log("users.controller.ts/patchPassword");
        return this.usersService.changePassword(password)
    }

    @Delete() @ApiOperation({summary: "supprimer votre compte utilisateur"})
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    delete(){
        console.log("users.controller.ts/delete");
        return this.usersService.delete();
    }
}
