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
import { LogsService } from 'src/middlewares/logs/logs.service';
import { ILogsMessages, StatusMethode } from 'src/shared/utilities/languages/bases/logsMessages.interface';
import { IResponsesHttp } from 'src/shared/utilities/languages/bases/responsesHttp.interface';
// import { LogsMessagesFactory } from 'src/shared/utilities/languages/logsMessages.factory';

@Injectable()
export class UsersService {
  httpText: IResponsesHttp = new ResponsesHttpFactory();
  httpCode: StatusHttp = new StatusHttp();
  //logM: ILogsMessages = new LogsMessagesFactory();

  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private readonly authS: AuthService,
    private readonly mailS: MailService,
    private readonly logS: LogsService,
    @Inject('ILogsMessages')
    private readonly logM: ILogsMessages,
  ) { }

  async inscription(user: CreateUserDTO) {
    this.logS.add(this.logM.userRegister(StatusMethode.START))
    await this.existEmailActif(user.email, true);//vérifie si email est actif dans la db

    let userN: UserEntity;
    if (await this.existEmail(user.email)) {//vérifie si email est déjà inscrit dans la db (mais inactif)
      userN = await this.reactivation(user);
    } else {
      userN = await this.create(user);
    }
    await this.usersRepo.save(userN)
      .catch(e => {
        this.logS.add(this.logM.userRegister(StatusMethode.ERROR, e))
        throw new HttpException(this.httpText.errorUnknow(e), this.httpCode.errorUnknow(e))
      })
    let userE = await this.getOneByEmail(user.email);

    //envoi mail pour validation email
    let codeValidationEmail = Generators.getNumber(userE.userId, 9999, userE.email)
    await this.mailS.sendNoReply(
      userE.email,
      UserContentMailFR.register(userE, codeValidationEmail).subject,
      UserContentMailFR.register(userE, codeValidationEmail).text,
      UserContentMailFR.register(userE, codeValidationEmail).html,
    )

    this.logS.add(this.logM.userRegister(StatusMethode.SUCCESS, this.httpText.userCreated(userE.email), userE), userE)
    //return
    return {
      statusCode: this.httpCode.userCreated,
      message: this.httpText.userCreated
    }
  }
  private async reactivation(user: CreateUserDTO): Promise<UserEntity> {
    this.logS.add(this.logM.userReactivate(StatusMethode.START))
    let userE = await this.getOneByEmail(user.email, true);
    this.logS.add(this.logM.userReactivate(StatusMethode.INFO, "Anciennes données utilisateurs", userE), userE);
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
  async validationEmail(user: ValidationUserDTO) {
    this.logS.add(this.logM.userValidate(StatusMethode.START))
    if (!(await this.existEmailActif(user.email))) {
      this.logS.add(this.logM.userValidate(StatusMethode.ERROR, this.httpText.userNotFound + " {email : " + user.email + "}"))
      throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound())
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    if (user.code == Generators.getNumber(userE.userId, 999999, userE.email)) {
      userE.isValidate = true;
      this.usersRepo.save(userE)
        .catch(e => {
          this.logS.add(this.logM.userValidate(StatusMethode.ERROR, e, userE), userE)
          throw new HttpException(this.httpText.errorUnknow(e), this.httpCode.errorUnknow(e))
        })
      await this.mailS.sendNoReply(
        user.email,
        UserContentMailFR.validateEmail(userE).subject,
        UserContentMailFR.validateEmail(userE).text,
        UserContentMailFR.validateEmail(userE).html
      )
      this.logS.add(this.logM.userValidate(StatusMethode.SUCCESS, this.httpText.userValidate(user.email), userE), userE)
      return {
        statusCode: this.httpCode.userValidate(user.email),
        message: this.httpText.userValidate(user.email)
      }
    }
  }
  async connexion(user: ConnexionUserDTO): Promise<TokenDTO> {
    this.logS.add(this.logM.userLogIn(StatusMethode.START))
    if (!(await this.existEmailActif(user.email))) {
      this.logS.add(this.logM.userLogIn(StatusMethode.ERROR, this.httpText.userNotFound+" {email : "+user.email+"}"))
      throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound())
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    if (await bcrypt.compare(user.password, userE.password)) {
      await this.patchLastConnexion(userE);
      this.logS.add(this.logM.userLogIn(StatusMethode.SUCCESS, "Connexion établie", userE), userE)
      let token: TokenDTO = await this.authS.login(userE);
      return token;
    } else {
      this.logS.add(this.logM.userLogIn(StatusMethode.ERROR, this.httpText.userNotFound+" (password KO)"), userE)
      throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound())
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
    this.logS.add(this.logM.userNewPassword(StatusMethode.START))
    if (!(await this.existEmailActif(user.email))) {
      this.logS.add(this.logM.userNewPassword(StatusMethode.ERROR, this.httpText.userNotFound+" {email : "+user.email+"}"))
      throw new HttpException(this.httpText.userNotFound(), this.httpCode.userNotFound())
    }

    let userE: UserEntity = await this.getOneByEmail(user.email)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    let newPassword = "changeME#" + Generators.getNumber(100000, 999999);
    console.log(newPassword);
    userE.password = await bcrypt.hash(newPassword, 10);
    userE.isRestricted = true;

    this.usersRepo.save(userE)
      .catch(e => {
        this.logS.add(this.logM.userNewPassword(StatusMethode.ERROR, e, userE), userE)
        throw new HttpException(this.httpText.errorUnknow(e), this.httpCode.errorUnknow(e))
      })
      this.mailS.sendNoReply(
        userE.email,
        UserContentMailFR.newPassword(userE, newPassword).subject,
        UserContentMailFR.newPassword(userE, newPassword).text,
        UserContentMailFR.newPassword(userE, newPassword).html
        )
        
        this.logS.add(this.logM.userNewPassword(StatusMethode.SUCCESS, this.httpText.userPasswordChanged(), userE), userE)
    return {
      statusCode: this.httpCode.userPasswordChanged(),
      message: this.httpText.userPasswordChanged()
    }
  }
  async get1(): Promise<User1DTO> {
    this.logS.add(this.logM.userGet1(StatusMethode.START))
    let userId: number = this.authS.getUserId();
    let userE: UserEntity = await this.getOneById(userId);
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)
    this.logS.add(this.logM.userGet1(StatusMethode.SUCCESS, "Utilisateur trouvé" ,userE), userE)
    return UserMapper.toUser1DTO(userE);
  }
  async changePassword(user: ChangePasswordUserDTO) {
    this.logS.add(this.logM.userChangePassword(StatusMethode.START))
    let userId: number = this.authS.getUserId();
    let userE: UserEntity = await this.getOneById(userId)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    userE.password = await bcrypt.hash(user.password, 10);
    userE.isRestricted = false;
    this.usersRepo.save(userE)
      .catch(e => {
        this.logS.add(this.logM.userChangePassword(StatusMethode.ERROR, e, userE), userE)
        throw new HttpException(this.httpText.errorUnknow(e), this.httpCode.errorUnknow(e))
      })
      this.logS.add(this.logM.userChangePassword(StatusMethode.SUCCESS, this.httpText.userPasswordChanged(), userE), userE)
    return {
      statusCode: this.httpCode.userPasswordChanged(),
      message: this.httpText.userPasswordChanged()
    }
  }
  async delete() {
    this.logS.add(this.logM.userDeleted(StatusMethode.START))
    let userId: number = this.authS.getUserId();
    let userE: UserEntity = await this.getOneById(userId)
    RoleAccess.isAuthorized(userE, UserRole.RESTRICTED)

    let userD = await this.usersRepo.softRemove(userE);
    this.usersRepo.save(userD)
      .catch(e => {
        this.logS.add(this.logM.userDeleted(StatusMethode.ERROR, e, userE), userE)
        throw new HttpException(this.httpText.errorUnknow(e), this.httpCode.errorUnknow(e))
      })

    this.mailS.sendNoReply(
      userE.email,
      UserContentMailFR.deleted(userE).subject,
      UserContentMailFR.deleted(userE).text,
      UserContentMailFR.deleted(userE).html
    )
    this.logS.add(this.logM.userDeleted(StatusMethode.START, this.httpText.userDeleted(userE.email), userE), userE)
    return {
      statusCode: this.httpCode.userDeleted(userE.email),
      message: this.httpText.userDeleted(userE.email)
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
}