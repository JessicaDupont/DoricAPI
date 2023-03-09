import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/security/auth/auth.service';
import { ChangePasswordUserDTO } from 'src/models/dto/users/changePassword.user.dto';
import { ConnexionUserDTO } from 'src/models/dto/users/connexion.user.dto';
import { CreateUserDTO } from 'src/models/dto/users/create.user.dto';
import { TokenDTO } from 'src/models/dto/users/token.dto';
import { ErrorMessage, ErrorStatus } from 'src/shared/utilities/error.fr.enum';
import { SuccessMessage, SuccessStatut } from 'src/shared/utilities/success.fr.enum';
import { Repository } from 'typeorm';
import { UserDTO } from '../models/dto/users/user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/shared/mail/mail.service';
import { Messages } from 'src/shared/utilities/messages.fr';
import { NewPasswordUserDTO } from 'src/models/dto/users/newPassword.user.dto';
import { UserEntity } from 'src/models/entities/user.entity';
import { User1DTO } from 'src/models/dto/users/user1.dto';
import { UserMapper } from 'src/models/mappers/user.mapper';
import { Generators } from 'src/shared/utilities/generators';
import { ValidationUserDTO } from 'src/models/dto/users/validation.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) { }

  async inscription(user: CreateUserDTO) {
    console.log("users.service.ts/create");
    if (await this.existEmail(user.email)) {
      throw new HttpException(ErrorMessage.USER_EXIST, ErrorStatus.USER_EXIST)
    }

    user.password = await bcrypt.hash(user.password, 10);
    let newUser = this.usersRepo.create(user);
    await this.usersRepo.save(newUser)
      .catch(_ => {
        throw new HttpException(ErrorMessage.ERROR_UNKNOW, ErrorStatus.ERROR_UNKNOW)
      })

    let userE = await this.getOneByEmail(user.email);
    let codeValidationEmail = Generators.getNumber(userE.userId, 9999, userE.email)
    await this.mailService.sendNoReply(
      userE.email,
      Messages.getMailUserRegisterSubject(),
      Messages.getMailUserRegisterText(userE.name, userE.email, codeValidationEmail),
      Messages.getMailUserRegisterHtml(userE.name, userE.email, codeValidationEmail)
    )

    return {
      statusCode: SuccessStatut.USER_CREATED,
      message: SuccessMessage.USER_CREATED
    }
  }
  async validationEmail(user: ValidationUserDTO) {
    if (!(await this.existEmail(user.email))) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    if (user.code == Generators.getNumber(userE.userId, 999999, userE.email)) {
      userE.validationEmail = true;
      this.usersRepo.save(userE)
        .catch(_ => {
          throw new HttpException(ErrorMessage.ERROR_UNKNOW, ErrorStatus.ERROR_UNKNOW)
        })

      await this.mailService.sendNoReply(
        user.email,
        Messages.getMailUserValidateSubject(),
        Messages.getMailUserValidateText(userE.name, userE.email, userE.url),
        Messages.getMailUserValidateHtml(userE.name, userE.email, userE.url)
      )
      return {
        statusCode: SuccessStatut.EMAIL_VALIDATE,
        message: SuccessMessage.EMAIL_VALIDATE
      }
    }
  }
  async connexion(user: ConnexionUserDTO): Promise<TokenDTO> {
    console.log("users.service.ts/connexion");
    if (!(await this.existEmail(user.email))) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    if (await bcrypt.compare(user.password, userE.password)) {
      await this.patchLastConnexion(userE);
      let token: TokenDTO = await this.authService.login(userE);
      return token;
    } else {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    }
  }
  async newPassword(user: NewPasswordUserDTO) {
    console.log("users.service.ts/newpassword");

    if (!(await this.existEmail(user.email))) {
      throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    let newPassword = "changeME#" + Generators.getNumber(100000, 999999);
    userE.password = await bcrypt.hash(newPassword, 10);
    userE.newPassword = false;

    this.usersRepo.save(userE)
      .catch(_ => {
        throw new HttpException(ErrorMessage.ERROR_UNKNOW, ErrorStatus.ERROR_UNKNOW)
      })

    this.mailService.sendNoReply(
      userE.email,
      Messages.getMailUserNewpasswordSubject(),
      Messages.getMailUserNewpasswordText(userE.name, userE.email, userE.url, newPassword),
      Messages.getMailUserNewpasswordHtml(userE.name, userE.email, userE.url, newPassword)
    )

    return {
      statusCode: SuccessStatut.PASSWORD_CHANGED,
      message: SuccessMessage.PASSWORD_CHANGED
    }
  }
  async get1(): Promise<User1DTO> {
    let userId: number = this.authService.getUserId();
    let userE: UserEntity = await this.getOneById(userId);
    if (!userE) {
      throw new HttpException(ErrorMessage.USER_UNAUTHORIZED, ErrorStatus.USER_UNAUTHORIZED)
    }
    return UserMapper.toUser1DTO(userE);
  }
  async changePassword(user: ChangePasswordUserDTO) {
    console.log("users.service.ts/changepassword");
    let userId: number = this.authService.getUserId();
    let userE: UserEntity = await this.getOneById(userId)
    if (!userE) {
      throw new HttpException(ErrorMessage.USER_UNAUTHORIZED, ErrorStatus.USER_UNAUTHORIZED)
    }

    userE.password = await bcrypt.hash(user.password, 10);
    userE.newPassword = true;
    this.usersRepo.save(userE)
      .catch(_ => {
        throw new HttpException(ErrorMessage.ERROR_UNKNOW, ErrorStatus.ERROR_UNKNOW)
      })
    return {
      statusCode: SuccessStatut.PASSWORD_CHANGED,
      message: SuccessMessage.PASSWORD_CHANGED
    }
  }
  async delete() {
    console.log("users.service.ts/delete");
    let userId: number = this.authService.getUserId();
    let userE: UserEntity = await this.getOneById(userId)
    if (!userE) {
      throw new HttpException(ErrorMessage.USER_UNAUTHORIZED, ErrorStatus.USER_UNAUTHORIZED)
    }

    let userD = await this.usersRepo.softRemove(userE);
    this.usersRepo.save(userD)
      .catch(_ => {
        throw new HttpException(ErrorMessage.ERROR_UNKNOW, ErrorStatus.ERROR_UNKNOW)
      })
    return {
      statusCode: SuccessStatut.USER_DELETED,
      message: SuccessMessage.USER_DELETED
    }

  }

  private async getOneById(userId: number): Promise<UserEntity> {
    console.log("users.service.ts/getonebyID")
    return await this.usersRepo.findOneOrFail({
      where: {
        userId: userId
      }
    })
      .catch((error) => {
        throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
      })
  }
  private async existEmail(email: string): Promise<boolean> {
    let exist = await this.usersRepo.count({
      where: {
        email: email
      }
    })
    return exist > 0;
  }
  private async getOneByEmail(email: string): Promise<UserEntity> {
    console.log("users.service.ts/getonebyemail "+email)
    return this.usersRepo.findOneOrFail({
      where: {
        email: email
      }
    })
      .catch((error) => {
        throw new HttpException(ErrorMessage.USER_NOT_FOUND, ErrorStatus.USER_NOT_FOUND)
      })
  }
  private async patchLastConnexion(user: UserDTO) {
    console.log("users.service.ts/patchLastConnexion")
    let date = new Date()
    user.lastConnexion = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;;

    await this.usersRepo.save(user)
      .catch(_ => {
        return false;
      })
    return true;
  }
}

