import { HttpException, Inject, Injectable } from '@nestjs/common';
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
import { LogsService } from 'src/middlewares/log/logs.service';
import { ILogsMessages, StatusMethode } from 'src/shared/utilities/languages/bases/logsMessages.interface';
import { IResponsesHttp } from 'src/shared/utilities/languages/bases/responsesHttp.interface';

@Injectable()
export class UsersService {
  httpText: IResponsesHttp = new ResponsesHttpFactory();
  httpCode: StatusHttp = new StatusHttp();

  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private readonly authS: AuthService,
    private readonly mailS: MailService,
    private readonly logS: LogsService,
    @Inject('ILogsMessages')
    private readonly logM: ILogsMessages,
  ) { }

  async inscription(ip:string, user: CreateUserDTO) {
    this.logS.addWithException(ip, "users.service.ts/inscription", StatusMethode.START)

    if (await this.existEmailActif(user.email)) {
      return this.logS.addWithException(
        ip, 
        "users.service.ts/inscription",
        StatusMethode.ERROR,
        this.httpText.userYetExist(user.email),
        this.httpCode.userYetExist(user.email))
    }

    await this.createToDB(ip, user);
    let userE = await this.getOneByEmail(user.email);
    await this.mailToValidateEmail(userE);

    return this.logS.addWithException(
      ip, 
      "users.service.ts/inscription",
      StatusMethode.SUCCESS,
      this.httpText.userCreated(userE.email),
      this.httpCode.userCreated(userE.email),
      "{user_id: "+userE.userId+"}")
  }
  private async createToDB(ip:string, user: CreateUserDTO) {
    let userN: UserEntity;
    if (await this.existEmail(user.email)) {//vérifie si email est déjà inscrit dans la db (mais inactif)
      userN = await this.reactivation(ip, user);
    } else {
      userN = await this.create(user);
    }
    await this.usersRepo.save(userN)
      .catch(e => {
        this.logS.addWithException(
          ip, 
          "users.service.ts/createToDB",
          StatusMethode.ERROR,
          this.httpText.errorUnknow(e),
          this.httpCode.errorUnknow(e),
          "{user_id: "+userN.userId+"}")
      })
  }
  private async reactivation(ip:string, user: CreateUserDTO): Promise<UserEntity> {
    let userE = await this.getOneByEmail(user.email, true);
    this.logS.addWithException(
      ip, 
      "users.service.ts/reactivation",
      StatusMethode.INFO,
      UsersService.userJSON(userE),
      null,
      "{user_id: "+userE.userId+"}")

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
    user.password = await bcrypt.hash(user.password, 10);
    let userE = await this.usersRepo.create(user);
    return userE;
  }
  private async mailToValidateEmail(user: UserEntity) {
    let codeValidationEmail = Generators.getNumber(user.userId, 9999, user.email)
    return await this.mailS.sendNoReply(
      user.email,
      UserContentMailFR.register(user, codeValidationEmail).subject,
      UserContentMailFR.register(user, codeValidationEmail).text,
      UserContentMailFR.register(user, codeValidationEmail).html,
    )
  }
  async validationEmail(ip:string, user: ValidationUserDTO) {
    this.logS.addWithException(
      ip, 
      "users.service.ts/validationEmail",
      StatusMethode.START)

    if (!(await this.existEmailActif(user.email))) {
      this.logS.addWithException(
        ip, 
        "users.service.ts/validationEmail",
        StatusMethode.ERROR,
        this.httpText.userNotFound() + "{email: " + user.email + "}",
        this.httpCode.userNotFound())
    }
    let userE: UserEntity = await this.getOneByEmail(user.email)
    if (!(userE.isValidate)) {

      if (user.code == Generators.getNumber(userE.userId, 999999, userE.email)) {
        userE.isValidate = true;
        this.usersRepo.save(userE)
          .catch(e => {
            this.logS.addWithException(
              ip, 
              "users.service.ts/validationEmail",
              StatusMethode.ERROR,
              this.httpText.errorUnknow(e),
              this.httpCode.errorUnknow(e),
              "{user_id: "+userE.userId+"}");
          })

        await this.mailToConfirmValidationEmail(userE);
      }
    }
    
    return this.logS.addWithException(
      ip, 
      "users.service.ts/validationEmail",
      StatusMethode.SUCCESS,
      this.httpText.userValidate(userE.email),
      this.httpCode.userValidate(userE.email),
      "{user_id: "+userE.userId+"}")
  }
  private async mailToConfirmValidationEmail(user: UserEntity) {
    await this.mailS.sendNoReply(
      user.email,
      UserContentMailFR.validateEmail(user).subject,
      UserContentMailFR.validateEmail(user).text,
      UserContentMailFR.validateEmail(user).html
    )
  }
  async connexion(ip:string, user: ConnexionUserDTO): Promise<TokenDTO> {
    this.logS.addWithException(
      ip, 
      "users.service.ts/connexion",
      StatusMethode.START)

    if (!(await this.existEmailActif(user.email))) {
      this.logS.addWithException(
        ip, 
        "users.service.ts/connexion",
        StatusMethode.ERROR,
        this.httpText.userNotFound() + " {" + user.email + "}",
        this.httpCode.userNotFound())
    }
    let userE: UserEntity = await this.getOneByEmail(user.email)
    RoleAccess.isAuthorized(ip, this.logS, userE, UserRole.RESTRICTED)

    if (!(await bcrypt.compare(user.password, userE.password))) {
      throw this.logS.addWithException(
        ip, 
        "users.service.ts/connexion",
        StatusMethode.ERROR,
        this.httpText.userNotFound() + "[Erreur password]",
        this.httpCode.userNotFound(),
        "{user_id: "+userE.userId+"}")
    }
    await this.patchLastConnexion(userE);

    this.logS.addWithException(
      ip, 
      "users.service.ts/connexion",
      StatusMethode.INFO,
      this.httpText.userAuthorized(),
      this.httpCode.userAuthorized(),
      "{user_id: "+userE.userId+"}")

    let token: TokenDTO = await this.authS.login(userE);
    return token;
  }
  private async patchLastConnexion(user: UserDTO) {
    user.lastConnexion = new Date();

    await this.usersRepo.save(user)
      .catch(_ => {
        return false;
      })
    return true;
  }
  async newPassword(ip:string, user: NewPasswordUserDTO) {
    this.logS.addWithException(
      ip, 
      "users.services.ts/newPassword",
      StatusMethode.START
    )

    if (!(await this.existEmailActif(user.email))) {
      this.logS.addWithException(
        ip, 
        "users.services.ts/newPassword",
        StatusMethode.ERROR,
        this.httpText.userNotFound() + "{email: " + user.email + "}",
        this.httpCode.userNotFound()
      )
    }
    let userE: UserEntity = await this.getOneByEmail(user.email)
    RoleAccess.isAuthorized(ip, this.logS, userE, UserRole.RESTRICTED)

    let newPassword = await this.updatePassword(ip, userE);
    this.mailWithNewPassword(userE, newPassword);

    return this.logS.addWithException(
      ip, 
      "users.service/ts/newPassword",
      StatusMethode.SUCCESS,
      this.httpText.userPasswordChanged(),
      this.httpCode.userPasswordChanged(),
      "{user_id: "+userE.userId+"}"
    )
  }
  private async updatePassword(ip:string, user: UserEntity, password: string = null): Promise<string> {
    if (password == null) {
      password = "changeME#" + Generators.getNumber(100000, 999999);
    }
    user.password = await bcrypt.hash(password, 10);
    user.isRestricted = true;

    this.usersRepo.save(user)
      .catch(e => {
        this.logS.addWithException(
          ip, 
          "users.service.ts/updatePassword",
          StatusMethode.ERROR,
          this.httpText.errorUnknow(e),
          this.httpCode.errorUnknow(e),
          "{user_id: "+user.userId+"}"
        )
      })

    return password;
  }
  private mailWithNewPassword(user: UserEntity, newPassword: string) {
    this.mailS.sendNoReply(
      user.email,
      UserContentMailFR.newPassword(user, newPassword).subject,
      UserContentMailFR.newPassword(user, newPassword).text,
      UserContentMailFR.newPassword(user, newPassword).html
    )
  }
  async get1(ip:string, ): Promise<User1DTO> {
    this.logS.addWithException(
      ip, 
      "users.service.ts/get1",
      StatusMethode.START
    )

    let userE: UserEntity = await this.getOneById(this.authS.getUserId());
    RoleAccess.isAuthorized(ip, this.logS, userE, UserRole.RESTRICTED)

    this.logS.addWithException(
      ip, 
      "users.service.ts/get1",
      StatusMethode.INFO,
      this.httpText.userAuthorized(),
      this.httpCode.userAuthorized(),
      "{user_id: "+userE.userId+"}"
    )
    return UserMapper.toUser1DTO(userE);
  }
  async changePassword(ip:string, user: ChangePasswordUserDTO) {
    this.logS.addWithException(
      ip, 
      "users.service.ts/changePassword",
      StatusMethode.START
    )

    let userE: UserEntity = await this.getOneById(this.authS.getUserId())
    RoleAccess.isAuthorized(ip, this.logS, userE, UserRole.RESTRICTED)

    await this.updatePassword(ip, userE, user.password)

    return this.logS.addWithException(
      ip, 
      "users.service.ts/changePassword",
      StatusMethode.SUCCESS,
      this.httpText.userPasswordChanged(),
      this.httpCode.userPasswordChanged(),
      "{user_id: "+userE.userId+"}"
    )
  }
  async softDelete(ip:string) {
    this.logS.addWithException(
      ip, 
      "users.service.ts/delete",
      StatusMethode.START
    )

    let userE: UserEntity = await this.getOneById(this.authS.getUserId())
    RoleAccess.isAuthorized(ip, this.logS, userE, UserRole.RESTRICTED)

    let userD = await this.usersRepo.softRemove(userE);
    this.usersRepo.save(userD)
      .catch(e => {
        this.logS.addWithException(
          ip, 
          "users.service.ts/delete",
          StatusMethode.ERROR,
          this.httpText.errorUnknow(e),
          this.httpCode.errorUnknow(e),
          "{user_id: "+userE.userId+"}"
        )
      })

    this.mailToDelete(userE);

    return this.logS.addWithException(
      ip, 
      "users.service.ts/delete",
      StatusMethode.SUCCESS,
      this.httpText.userDeleted(userE.email),
      this.httpCode.userDeleted(userE.email),
      "{user_id: "+userE.userId+"}"
    )
  }
  private mailToDelete(user: UserEntity) {
    this.mailS.sendNoReply(
      user.email,
      UserContentMailFR.deleted(user).subject,
      UserContentMailFR.deleted(user).text,
      UserContentMailFR.deleted(user).html
    )
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
      if (exceptionTrue) { throw new HttpException(this.httpText.userYetExist(email), this.httpCode.userYetExist(email)) }
      else { return true; }
    } else {
      if (exceptionFalse) { throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound()) }
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
        throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound())
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
        throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound())
      })
  }
  static userJSON(user: UserEntity = null): string {
    return user == null ? "pas d'information sur l'utilisateur" : "{"
      + "deleteAt: " + user.deleteAt + ","
      + "updateAt: " + user.updateAt + ", "
      + "createdAt: " + user.createdAt + ", "
      + "user_id : " + user.userId + ", "
      + "role: " + user.role + ", "
      + "name: " + user.name + ", "
      + "email: " + user.email + ", "
      + "is_validate: " + user.isValidate + ", "
      + "password: " + user.password + ", "
      + "is_restricted: " + user.isRestricted + ", "
      + "url: " + user.url + ", "
      + "last_connexion: " + user.lastConnexion
      + "}";
  }
}