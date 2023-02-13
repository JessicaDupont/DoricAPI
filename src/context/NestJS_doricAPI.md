# DoricAPI - les étapes de création du projet
documentation officielle : [www.nestjs.com](https://docs.nestjs.com/)
* [Initialisation](#initialisation--git)
  * [.env](#configuration-utilisation-env)
  * [Swagger](#swagger)
## Initialisation + git
1. `ctrl + ù` : ouverture du terminal
2. `npm i -g @nestjs/cli` : installation de nodeJS
3. `nest new doricAPI`
    * `npm`
4. `cd doric-api`
5. `npm run start:dev` : ouvrir le navigateur sur le lien [http://localhost:3000/](http://localhost:3000/) (`ctrl + c` pour arreter)
6. création du repository git + push : [Github.com : JessicaDupont/DoricAPI](https://github.com/JessicaDupont/DoricAPI)
### Configuration (utilisation .env)
[Documentation Configuration](https://docs.nestjs.com/techniques/configuration)
1. `npm i --save @nestjs/config`
2. à la racine du projet, créer un fichier `.env`
3. dans `.gitignore`, ajouter le fichier `.env`
4. dans `.env`, ajouter `PORT_LOCAL = "3000"`
5. dans `main.ts`, remplacer `app.listen(3000)` par `app.listen(process.env.PORT || process.env.PORT_LOCAL);`
5. créer un dossier `context`
6. dans le dossier `context`, créer un fichier `env.ts`
```ts
export default () => ({
    port: parseInt(process.env.PORT) || 3000
});
```
7. dans `app.module.ts`, ajouter un `imports`
```ts
//import précédents
import {ConfigModule} from '@nestjs/config';
import env from './context/env';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, 
    load: [env]
  })],
//suite du code
```
### Swagger
[Documentation OpenAPI (swagger)](https://docs.nestjs.com/openapi/introduction)
1. `npm install --save @nestjs/swagger`
2. dans main.ts, mettre le code suivant:
```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

{
  const swaggerConfig = new DocumentBuilder()
    .setTitle('DoricAPI')
    .setDescription('API fournissant les informations sur Dorica RPG')
    .setVersion('1.0')
    .addTag('Clients', "Clients de l'API")
    .addTag('Tests', "Tests en pagailles")
    .build();
    const swaggerOptions: SwaggerDocumentOptions = {

    }
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
}
```
> après le `run start`, swagger est disponible sur [http://localhost:3000/api](http://localhost:3000/api). Le document Swagger est disponible [http://localhost:3000/api-json](http://localhost:3000/api-json)
## Mise en place de la sécurité
1. `npm i --save @nestjs/passport passport passport-local`
### Swagger
1. dans main.ts, dans la swaggerConfig, ajouter `.addBasicAuth({type: 'apiKey', name: 'dorica-API-key', in: 'header'})` 