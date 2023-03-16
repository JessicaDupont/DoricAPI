import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/security/auth/auth.service';
import { ChangePasswordUserDTO } from 'src/models/dto/users/changePassword.user.dto';
import { ConnexionUserDTO } from 'src/models/dto/users/connexion.user.dto';
import { CreateUserDTO } from 'src/models/dto/users/create.user.dto';
import { TokenDTO } from 'src/models/dto/users/token.dto';
import { Repository } from 'typeorm';
import { UserDTO } from '../models/dto/users/user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/shared/mail/mail.service';
import { NewPasswordUserDTO } from 'src/models/dto/users/newPassword.user.dto';
import { UserEntity, UserRoleBasic } from 'src/models/entities/user.entity';
import { User1DTO } from 'src/models/dto/users/user1.dto';
import { UserMapper } from 'src/models/mappers/user.mapper';
import { Generators } from 'src/shared/utilities/generators';
import { ValidationUserDTO } from 'src/models/dto/users/validation.user.dto';
import { RoleAccess, UserRole } from 'src/security/auth/roles.auth';
import { ResponsesHttpFactory } from 'src/shared/utilities/languages/responsesHttp.factory';
import { StatusHttp } from 'src/shared/utilities/languages/statusHttp';
import { UserContentMailFR } from 'src/shared/utilities/languages/fr/userContentMail';
import { LogsService } from 'src/middlewares/logs/logs.service';
import { ILogsMessages } from 'src/shared/utilities/languages/bases/logsMessages.interface';
import { IResponsesHttp } from 'src/shared/utilities/languages/bases/responsesHttp.interface';
import { LogsMessagesFactory } from 'src/shared/utilities/languages/logsMessages.factory';

@Injectable()
export class UsersService {
  resHttp: IResponsesHttp = new ResponsesHttpFactory();
  statHttp: StatusHttp = new StatusHttp();
  logMess: ILogsMessages = new LogsMessagesFactory();

  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly logsService: LogsService
  ) { }

  async inscription(user: CreateUserDTO) {
    console.log("users.service.ts/inscription");
    await this.existEmailActif(user.email, true);//vérifie si email est actif dans la db

    let create: boolean = false;
    let userN: UserEntity;
    if (await this.existEmail(user.email)) {//vérifie si email est déjà inscrit dans la db (mais inactif)
      userN = await this.reactivation(user);
    } else {
      userN = await this.create(user);
      create = true;
    }
    await this.usersRepo.save(userN)
      .catch(e => {
        throw new HttpException(this.resHttp.errorUnknow(e), this.statHttp.errorUnknow(e))
      })
    let userE = await this.getOneByEmail(user.email);
    if (create) { this.logsService.add(userE, this.logMess.userRegister()) }

    //envoi mail pour validation email
    let codeValidationEmail = Generators.getNumber(userE.userId, 9999, userE.email)
    await this.mailService.sendNoReply(
      userE.email,
      UserContentMailFR.register(userE, codeValidationEmail).subject,
      UserContentMailFR.register(userE, codeValidationEmail).text,
      UserContentMailFR.register(userE, codeValidationEmail).html,
    )

    //return
    return {
      statusCode: this.statHttp.userCreated,
      message: this.resHttp.userCreated
    }
  }
  private async reactivation(user: CreateUserDTO): Promise<UserEntity> {
    console.log("users.services.ts/reactivation")
    let userE = await this.getOneByEmail(user.email, true);
    this.logsService.add(userE, this.logMess.userReactivate(userE));
    await this.usersRepo.recover(userE);
    userE.password = await bcrypt.hash(user.password, 10);
    userE.name = user.name;
    userE.url = user.url;
    userE.role = UserRoleBasic.USER;
    userE.lastConnexion = null;
    userE.createdAt = new Date();
    // userE.deleteAt = null;//automatique avec .recover
    userE.isValidate = false;
    userE.isRestricted = false;
    return userE;
  }
  private async create(user: CreateUserDTO): Promise<UserEntity> {
    console.log("users.services.ts/create")
    user.password = await bcrypt.hash(user.password, 10);
    let userE = await this.usersRepo.create(user);
    // this.logsService.add(userE, this.logMess.userRegister());//pas d'userid
    return userE;
  }
  async validationEmail(user: ValidationUserDTO) {
    console.log("users.service.ts/validateemail", user)
    if (!(await this.existEmailActif(user.email))) {
      throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound())
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    if (user.code == Generators.getNumber(userE.userId, 999999, userE.email)) {
      userE.isValidate = true;
      this.usersRepo.save(userE)
        .catch(e => {
          this.logsService.add(userE, this.logMess.userValidate(false))
          throw new HttpException(this.resHttp.errorUnknow(e), this.statHttp.errorUnknow(e))
        })
      this.logsService.add(userE, this.logMess.userValidate(true))
      await this.mailService.sendNoReply(
        user.email,
        UserContentMailFR.validateEmail(userE).subject,
        UserContentMailFR.validateEmail(userE).text,
        UserContentMailFR.validateEmail(userE).html
      )
      return {
        statusCode: this.statHttp.userValidate(user.email),
        message: this.resHttp.userValidate(user.email)
      }
    }
  }
  async connexion(user: ConnexionUserDTO): Promise<TokenDTO> {
    console.log("users.service.ts/connexion");
    if (!(await this.existEmailActif(user.email))) {
      console.log("users.service.ts/connexion : email not exist");
      throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound())
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    if (await bcrypt.compare(user.password, userE.password)) {
      console.log("users.service.ts/connexion : password ok");
      await this.patchLastConnexion(userE);
      this.logsService.add(userE, this.logMess.userLogIn())
      let token: TokenDTO = await this.authService.login(userE);
      return token;
    } else {
      console.log("users.service.ts/connexion : password KO");
      throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound())
    }
  }
  private async patchLastConnexion(user: UserDTO) {
    user.lastConnexion = new Date();

    await this.usersRepo.save(user)
      .catch(_ => {
        return false;
      })
    return true;
  }
  async newPassword(user: NewPasswordUserDTO) {
    console.log("users.service.ts/newpassword");
    if (!(await this.existEmailActif(user.email))) {
      throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound())
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    let newPassword = "changeME#" + Generators.getNumber(100000, 999999);
    console.log(newPassword);
    userE.password = await bcrypt.hash(newPassword, 10);
    userE.isRestricted = true;

    this.usersRepo.save(userE)
      .catch(e => {
        throw new HttpException(this.resHttp.errorUnknow(e), this.statHttp.errorUnknow(e))
      })
    this.logsService.add(userE, this.logMess.userNewPassword())
    this.mailService.sendNoReply(
      userE.email,
      UserContentMailFR.newPassword(userE, newPassword).subject,
      UserContentMailFR.newPassword(userE, newPassword).text,
      UserContentMailFR.newPassword(userE, newPassword).html
    )

    return {
      statusCode: this.statHttp.userPasswordChanged(),
      message: this.resHttp.userPasswordChanged()
    }
  }
  async get1(): Promise<User1DTO> {
    let userId: number = this.authService.getUserId();
    let userE: UserEntity = await this.getOneById(userId);
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)
    this.logsService.add(userE, this.logMess.userGet1(userE))
    return UserMapper.toUser1DTO(userE);
  }
  async changePassword(user: ChangePasswordUserDTO) {
    console.log("users.service.ts/changepassword");
    let userId: number = this.authService.getUserId();
    let userE: UserEntity = await this.getOneById(userId)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    userE.password = await bcrypt.hash(user.password, 10);
    userE.isRestricted = false;
    this.usersRepo.save(userE)
      .catch(e => {
        throw new HttpException(this.resHttp.errorUnknow(e), this.statHttp.errorUnknow(e))
      })
    this.logsService.add(userE, this.logMess.userChangePassword())
    return {
      statusCode: this.statHttp.userPasswordChanged(),
      message: this.resHttp.userPasswordChanged()
    }
  }
  async delete() {
    console.log("users.service.ts/delete");
    let userId: number = this.authService.getUserId();
    let userE: UserEntity = await this.getOneById(userId)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    let userD = await this.usersRepo.softRemove(userE);
    this.usersRepo.save(userD)
      .catch(e => {
        throw new HttpException(this.resHttp.errorUnknow(e), this.statHttp.errorUnknow(e))
      })
    this.logsService.add(userE, this.logMess.userDeleted())
    this.mailService.sendNoReply(
      userE.email,
      UserContentMailFR.deleted(userE).subject,
      UserContentMailFR.deleted(userE).text,
      UserContentMailFR.deleted(userE).html
    )
    return {
      statusCode: this.statHttp.userDeleted(userE.email),
      message: this.resHttp.userDeleted(userE.email)
    }

  }

  /**
   * 
   * @param email adresse email à vérifier en DB
   * @param exceptionTrue lance une exception si l'adresse email existe en DB
   * @param exceptionFalse lance une exception si l'adresse email n'existe PAS en DB
   * @returns true si l'adresse existe, false si elle n'existe pas
   */
  private async existEmailActif(email: string, exceptionTrue: boolean = false, exceptionFalse: boolean = false): Promise<boolean> {
    let exist = await this.usersRepo.count({
      where: {
        email: email
      }
    })

    // console.log("count ACTIFS = "+exist);
    if (exist > 0) {
      if (exceptionTrue) { throw new HttpException(this.resHttp.userYetExist(email), this.statHttp.userYetExist(email)) }
      else { return true; }
    } else {
      if (exceptionFalse) { throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound()) }
      else { return false; }
    }
  }
  private async existEmail(email: string): Promise<boolean> {
    let exist = await this.usersRepo.count({
      withDeleted: true,
      where: {
        email: email
      }
    })
    // console.log("count = "+exist);
    return exist > 0;
  }
  private async getOneById(userId: number): Promise<UserEntity> {
    return await this.usersRepo.findOneOrFail({
      where: {
        userId: userId
      }
    })
      .catch((error) => {
        throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound())
      })
  }
  private async getOneByEmail(email: string, withDeleted: boolean = false): Promise<UserEntity> {
    // console.log("users.services.ts/getonebyemail");
    return this.usersRepo.findOneOrFail({
      withDeleted: withDeleted,
      where: {
        email: email
      }
    })
      .catch((error) => {
        throw new HttpException(this.resHttp.userNotFound(), this.statHttp.userNotFound())
      })
  }
}