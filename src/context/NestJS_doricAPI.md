# DoricAPI - l'es étapes de création du projet
documentation officielle : [www.nestjs.com](https://docs.nestjs.com/)
* [Initialisation](#initialisation)
* [.env](#envirronement-équivalent-env)
## Initialisation
1. `ctrl + ù` : ouverture du terminal
2. `npm i -g @nestjs/cli` : installation de nodeJS
3. `nest new doricAPI`
    * `npm`
4. `cd doric-api`
5. `npm run start:dev` : ouvrir le navigateur sur le lien [http://localhost:3000/](http://localhost:3000/) (`ctrl + c` pour arreter)
6. création du repository git + push : [Github.com : JessicaDupont/DoricAPI](https://github.com/JessicaDupont/DoricAPI)
### Envirronement (équivalent .env)
1. `npm i --save @nestjs/config`
2. à la racine du projet, créer un fichier `.env`
3. dans `.gitignore`, ajouter le fichier `.env`
4. dans `.env`, ajouter `PORT = "3000"`
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
//suite
```