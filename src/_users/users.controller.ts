import { Controller, UseGuards, 
    Post, Get, Patch, Put, Delete, 
    Body, ValidationPipe, 
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
    create(@Body(ValidationPipe) user:CreateUserDTO){
        return this.usersService.inscription(user);
    }

    @Post('validationEmail') @ApiOperation({summary: "Validez votre adresse mail grâce au code reçu"})
    validateEmail(@Body(ValidationPipe) user : ValidationUserDTO){
        return this.usersService.validationEmail(user);
    }

    @Post('connexion') @ApiOperation({summary: "connexion à l'API pour recevoir un token"})
    connect(@Body(ValidationPipe) user:ConnexionUserDTO) : Promise<TokenDTO>{
        return this.usersService.connexion(user);
    }

    
    @Get('myProfil') @ApiOperation({summary: "voir votre profil utilisateur"})
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    async get1() : Promise<User1DTO>{
        return await this.usersService.get1();
    }

    // @Get()
    // @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    // getAll(){
    //     console.log("users.controller.ts/getAll");
    //     throw new NotImplementedException();
    // }

    // @Put() 
    // @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    // update(){
    //     console.log("users.controller.ts/update");
    //     throw new NotImplementedException();
    // }

    @Patch('newPassword') @ApiOperation({summary: "envoi un nouveau password par email"})
    newPassword(@Body(ValidationPipe) user:NewPasswordUserDTO){
        return this.usersService.newPassword(user)
    }

    @Patch('changePassword') @ApiOperation({summary: "permet à l'utilisateur connecté de choisir un nouveau password"})
    @UseGuards(JwtAuthGuard) @ApiBearerAuth("dorica_access")
    changePassword(@Body(ValidationPipe) password:ChangePasswordUserDTO){
        return this.usersService.changePassword(password)
    }

    @Delete() @ApiOperation({summary: "supprimer votre compte utilisateur"})
    @UseGuards(JwtAuthGuard)  @ApiBearerAuth("dorica_access")
    delete(){
        return this.usersService.delete();
    }
}
