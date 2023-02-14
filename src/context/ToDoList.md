# Security/Auth
* `auth.module.ts` : utiliser config pour jwt_secret_key
* `auth.service.ts` : protéger mdp avec `bcrypt`
# Clients
* `clients.service.ts` : connecter à la DB
* `@GET('connexion')` : app.controller.ts ==> clients.controller.ts