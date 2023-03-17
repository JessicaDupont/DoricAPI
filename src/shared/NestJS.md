# NestJS
[:books: Documentation officielle : www.nestjs.com](https://docs.nestjs.com/)
1. [Initialisation](#1-initialisation)
    1. [Création](#11-création-projet)
    2. [Git](#12-gitt)
    3. [.env](#13-env)
    4. [DB](#14-connexion-db-typeorm)
        1. [MySQL](#141-mysql)
    5. [Swagger](#15-swagger)
2. [Users|Clients](#2-usersclients)
    1. [Module](#21-module)
    2. [Models](#22-models)
        1. [Annotations](#221-annotations)
            1. [Validation](#221-validator)
            2. [Types DB](#222-db-typeorm)
            3. [Format Swagger](#223-swagger)
        2. [Models pour Swagger](#222-models-particuliers-pour-swagger-optionnel)
    3. [Controller](#23-controller)
        1. [Annotations pour Swagger](#231-annotations-swagger)
    4. [Service](#24-service)
        1. [Relais DB](#241-appels-db)
3. [Sécurité](#3-sécurité)
    1. [Cacher les données](#31-cryptage-et-hashage)
    2. [Authentification](#32-authentification)

[:top: Remonter](#nestjs)
***
# 1. Initialisation
[:top: Remonter](#nestjs)
1. [Création](#11-création-projet)
2. [Git](#12-gitt)
3. [.env](#13-env)
4. [DB](#14-connexion-db-typeorm)
5. [Swagger](#15-swagger)
## 1.1. Création projet
1. `ctrl`+`ù` : terminal
2. `npm i -g @nestjs/cli`
3. `nest new doricAPI`
    - `npm`
4. `cd doric-api`
5. `npm run start:dev` : app lancée sur [http://localhost:3000]()
6. `ctrl`+`c` : arrter le programme
## 1.2. Git
[Github.com : JessicaDupont/DoricAPI](https://github.com/JessicaDupont/DoricAPI)
## 1.3. .env
[:books: Documentation](https://docs.nestjs.com/techniques/configuration)
1. dans `doric-api/`, créer une fichier `.env`
    ```c
    PORT_LOCAL = 3000
    JWT_SECRET_KEY = "untokenpourlesgouvernertous"
    DB_HOST = "127.0.0.1"
    DB_PORT = "3306"
    DB_USERNAME = "root"
    DB_PASSWORD = "root"
    DB_NAME = "dorica"
    ```
2. dans `doric-api/.gitignore`, ajouter `.env`
3. `npm i --save @nestjs/config`
4. dans `doric-api/src/`, créer le dossier `context`, créer le fichier `env.ts`
    ```ts
    export default () => ({
        port: parseInt(process.env.PORT) || parseInt(process.env.PORT)
    });
    ```
5. dans `doric-api/src/app.module.ts`, ajouter dans `imports`
    ```ts
    ConfigModule.forRoot({
        isGlobal: true, 
        load: [env]//env correspond à context/env.ts
    }),
    ```
## 1.4. Connexion DB TypeORM
[:books: Documentation](https://typeorm.io/)
1. [MySQL](#141-mysql)
### 1.4.1. MySQL
1. `npm i --save @nestjs/typeorm typeorm mysql2`
2. dans `doric-api/src/app.module.ts`, dans `imports`
    ```ts
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [],
        synchronize: true,//mettre a false en prod
    }),
    ```
3. pour chaque module utilisant la DB, ajouter dans `imports`
    ```ts
    TypeOrmModule.forFeature([/*nom du modele*/])
    ```
## 1.5. Swagger
[:books Documentation](https://docs.nestjs.com/openapi/introduction)
1. `npm i --save @nestjs/swagger`
2. dans `doric-api/src/main.ts`, ajouter
    ```ts
    const swaggerConfig = new DocumentBuilder()
        .setTitle('DoricAPI')
        .setDescription('API fournissant les informations sur Dorica RPG')
        .setVersion('1.0')
        .setContact(
            "Jessica Dupont", 
            "http://alagaesiAPI.jessicadupont.net", 
            "contact@jessicadupont.net"
        )
        .addTag('Clients', "Clients de l'API")
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    ```
3. swagger est disponible à [http://localhost:3000/api]()
4. l'équivalent du `swagger.json` est disponible à [http://localhost:3000/api-json]()
# 2. Users|Clients
[:top: Remonter](#nestjs)
1. [Module](#21-module)
2. [Models](#22-models)
3. [Controller](#23-controller)
4. [Service](#24-service)
## 2.1. Module
[:books: Documentation](https://docs.nestjs.com/modules)
1. `nest g module Clients`
2. *(optionnel)* ajouter l'`imports` de TypeOrmModule (voir [dans la partie DB](#14-connexion-db-typeorm))
## 2.2. Models
1. créer un dossier `models` dans le dossier du module clients
2. créer un fichier `client.model.ts` dans le dossier `models`
3. créer une classe avec la structure de base d'un client
    ```ts
    export class Client{
        clientId: number;
        inscription: string;
        lastConnexion: string;
        url: string;
        name: string;
        email: string;
        password: string;
    }
    ```
### 2.2.1 Annotations
1. [Validation](#221-validator)
2. [Types DB](#222-db-typeorm)
3. [Format Swagger](#223-swagger)
> Toutes les annotations peuvent être mise sur le même document, mais pas conseillé (entité(DAL) vs DTO)
#### 2.2.1.1. Validator
[:books: Documentation](https://www.npmjs.com/package/class-validator)
1. `npm i --save class-validator class-transformer`
2. ajouter des annotations au-dessus des éléments afin d'assurer une validation
    ```ts
    import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
    export class Client{
        @IsInt()
        clientId: number;

        @IsDate()
        inscription: string;

        @IsDate()
        lastConnexion: string;

        @IsUrl()
        url: string;

        @IsString()
        name: string;

        @IsEmail()
        @IsNotEmpty()
        email: string;

        @IsNotEmpty()
        password: string;
    }
    ```
#### 2.2.1.2. DB TypeORM
[:books: Documentation](https://typeorm.io/entities)
1. ajouter des annotations au-dessus des éléments afin d'assurer une validation liée à la table en DB
    ```ts
    import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
    @Entity({name: "admin_api_clients"})
    export class Client{
        @PrimaryGeneratedColumn({
            type: "int",
            name: "client_id"
        })
        clientId: number;

        @CreateDateColumn()
        inscription: string;
        
        @Column({
            type: "date",
            name: "last_connexion"
        })
        lastConnexion: string;
        
        @Column({
            type: "varchar",
            length: 250,
            nullable: true
        })
        url: string;
        
        @Column({
            type: "varchar",
            length: 100
        })
        name: string;
        
        @Column({
            type: "varchar",
            length: 255,
            unique: true
        })
        email: string;
        
        @Column({
            type: "varchar",
            length: 255
        })
        password: string;
    }
    ```
#### 2.2.1.3. Swagger
1. ajouter des annotations au-dessus des éléments afin d'assurer une validation à l'entrée des données via Swagger
    ```ts
    import { ApiProperty } from "@nestjs/swagger";
    export class Client{
        @ApiProperty({
            required: false
        })
        clientId: number;

        @ApiProperty({
            required: false,
            format: "date"
        })
        inscription: string;

        @ApiProperty({
            required: false,
            format: "date"
        })
        lastConnexion: string;
        
        @ApiProperty({
            required: false,
            pattern: "^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/",
            example: "http://www.example.com"
        })
        url: string;
        
        @ApiProperty({
            required: false
        })
        name: string;

        @ApiProperty({
            required: true,
            format: "email",
            pattern: "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
        })
        email: string;
        
        @ApiProperty({
            required: true
        })
        password: string;
    }
    ```
### 2.2.2. Models particuliers pour Swagger *(optionnel)*
[:books: Documentation](https://docs.nestjs.com/openapi/mapped-types)
1. créer un fichier `clientConnect.model.ts` dans le dossier `models`
    ```ts
    export class ClientConnect extends PickType(
    Client, //de client.model.ts
    [
        'email', 
        'password'
    ]
    ){}
    ```
> Cette classe reprend `email` et `password` de la classe `client`, ainsi que toute ses annotations.
## 2.3. Controller
[:books: Documentation](https://docs.nestjs.com/controllers)
1. `nest g controller clients`
2. création des méthodes dans la classe `ClientsController`
    ```ts
    import { Body, Controller, Post, Get, Res } from '@nestjs/common';
    import { ConnectClient } from './models/connectClient.model';
    import { CreateClient } from './models/createClient.model';
    @Controller('clients')
    export class ClientsController {    
        @Post('inscription')
        inscription(@Body() client:CreateClient, @Res() response){
            return response.status(404).send({message: "Non implémenté"});
        }
    }
    ```
### 2.3.1. Annotations Swagger
[:books: Documentation](https://docs.nestjs.com/openapi/operations)
1. *(optionnel)* Lié le controlleur à un tag (peut se faire sur chaque méthode également)
    ```ts
    @ApiTags('Clients')//correspond au tag dans mains.ts lors de la configuration de Swagger
    ```
2. pour chaque méthode, indiquer les réponses possibles
    ```ts
        @ApiCreatedResponse({status: 201, description: "Le client a bien été enregistré."})
        @ApiResponse({status: 406, description: "Email invalide."})
        @ApiResponse({status: 418, description: "Email déjà enregistré."})
    ```
## 2.4. Service
[:books: Documentation](https://docs.nestjs.com/providers#services)
1. `nest g service clients`
### 2.4.1 Appels DB
1. dans `clients.module.ts`, vérifier que `TypeOrmModule.forFeature([Client])` est bien défini dans les `imports`
2. dans `clients.service.ts`, ajouter un constructeur
    ```ts
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Client } from './models/client.model';
    @Injectable()
    export class ClientsService {
        constructor(
            @InjectRepository(Client) private clientRepository: Repository<Client>
        ) {}
    }
    ```
3. Dans `clients.controller.ts`, ajouter un constructeur vers le service
    ```ts
        constructor(
            private readonly clientsService: ClientsService
        ){}
    ```
4. Dans `clients.service.ts`, ajouter les méthodes dont le controlleur a besoin
    ```ts
        create(client : CreateClient){
            let c = this.clientRepository.create({
                url: client.url,
                name: client.name,
                email: client.email,
                password: client.password
            });
            this.clientRepository.save(c);
            return null;
        }

        async existEmail(email: string) : Promise<boolean> {
            let exist = await this.clientRepository.count({
                where: {
                    email: email
                }
            })
            return exist > 0;
        }
    ```
# 3. Sécurité
[:top: Remonter](#nestjs)
## 3.1. Cryptage et Hashage
1. `npm i bcrypt`
2. créer le dossier `src/security/secureData`, créer le fichier `crypt.ts`
    ```ts
    import * as bcrypt from 'bcrypt';
    export class Crypt{
        static async securePassword(password: string): Promise<string> {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(password, saltOrRounds);
            return hash;
        }
    }
    ```
## 3.2. Authentification
[:books: Documentation](https://docs.nestjs.com/security/authentication)
1. `npm i --save @nestjs/passport passport passport-local`
2. `npm i --save-dev @types/passport-local` identification par login/password
3. `npm i --save @nestjs/jwt passport-jwt`
4. `npm i --save-dev @types/passport-jwt`
5. `nest g module security/auth`
6. `nest g service security/auth`