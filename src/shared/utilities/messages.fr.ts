export class Messages{
    //#region Mail User Register
    static getMailUserRegisterSubject() : string { 
        return "Demande de validation de votre adresse email pour DoricAPI";
    }
    static getMailUserRegisterText(name: string, email: string, code: number) : string {
        return "Bonjour "+name
            +"\nCe mail vous est envoyé suite à votre inscription sur l'API de Dorica."
            +"\nDoricAPI vous fournit des informations sur le système de jeu Dorica."
            +"\nRéférez-vous à la documentation Swagger pour intégrer l'API à votre application"
            +"\nLien de DoricAPI : http://www.api.dorica.miss-ica.be"
            +"\n"
            +"\nVeuillez confirmer votre adresse email pour valider votre inscription."
            +"\nProcédure de validation : "
            +"\n\t1. Rendez-vous sur http://www.api.dorica.miss-ica.be"
            +"\n\t2. Choississez \"Valider mon adresse email\" dans Swagger"
            +"\n\t3. Cliquez sur Try it out (en haut à droite)"
            +"\n\t4. Copiez le texte ci-dessous dans le body : "
            +"\n\t{\"email\": \""+email+"\", \"code\": "+code+"}"
            +"\n\t5. Exécutez la demande"
            +"\n"
            +"\nJe vous souhaite bon jeu avec Dorica."
            +"\nMiss Ica"
    }
    static getMailUserRegisterHtml(name: string, email: string, code: number) : string {
        return "<h1>Bonjour "+name+"!</h1>"
        +"<p>Ce mail vous est envoyé suite à votre inscription sur l'API de Dorica.</p>"
        +"<p>DoricAPI vous fournit des informations sur le système de jeu Dorica."
            +"<br/>Référez-vous à la documentation Swagger pour intégrer l'API à votre application"
            +"<br/>Lien de DoricAPI : <a href=\"http://www.api.dorica.miss-ica.be\">www.api.dorica.miss-ica.be</a></p>"
        +"<p>Veuillez confirmer votre adresse email pour valider votre inscription."
        +"<br>Procédure de validation : "
            +"<ul>"
                +"<ol>Rendez-vous sur <a href=\"http://www.api.dorica.miss-ica.be\">www.api.dorica.miss-ica.be</a>.</ol>"
                +"<ol>Choississez <i>Valider mon adresse email</i> dans Swagger>.</ol>"
                +"<ol>Cliquez sur <i>Try it out (en haut à droite)</i>.</ol>"
                +"<ol>Copiez le texte suivant dans le body : "
                    +"<q>{\"email\": \""+email+"\", \"code\": "+code+"}</q>"
                +"</ol>"
                +"<ol>Exécutez la demande.</ol>"
        +"</p>"
        +"<p>Je vous souhaite bon jeu avec Dorica.</p>"
        +"<p style=\"margin-left: 50%;\">Miss Ica</p>"
    }
    //#endregion
    
    //#region Mail User Validate email
    static getMailUserValidateSubject() : string { 
        return "Confirmation de votre inscription à DoricAPI";
    }
    static getMailUserValidateText(name: string, email: string, url: string) : string {
        return "Bonjour "+name
            +"\nCe mail vous est envoyé suite à la validation de votre email sur l'API de Dorica."
            +"\nDoricAPI vous fournit des informations sur le système de jeu Dorica."
            +"\nRéférez-vous à la documentation Swagger pour intégrer l'API à votre application"
            +"\nLien de DoricAPI : http://www.api.dorica.miss-ica.be"
            +"\n"
            +"\nVos données sont :"
            +"\n\tNom : "+name
            +"\n\tEmail : "+email+" (votre email sert également d'identifiant)"
            +"\n\tMot de passe : [celui que vous avez entré sur le site]"
            +"\n\tUrl : "+url
            +"\n"
            +"\nJe vous souhaite bon jeu avec Dorica."
            +"\nMiss Ica"
    }
    static getMailUserValidateHtml(name: string, email: string, url: string) : string {
        return "<h1>Bonjour "+name+"!</h1>"
        +"<p>Ce mail vous est envoyé suite à la valdiation de votre email sur l'API de Dorica.</p>"
        +"<p>DoricAPI vous fournit des informations sur le système de jeu Dorica."
            +"<br/>Référez-vous à la documentation Swagger pour intégrer l'API à votre application"
            +"<br/>Lien de DoricAPI : <a href=\"http://www.api.dorica.miss-ica.be\">www.api.dorica.miss-ica.be</a></p>"
        +"<p>Vos données sont :"
            +"<ul>"
                +"<li><b>Nom : </b>"+name+"</li>"
                +"<li><b>Email : </b>"+email+" (votre email sert également d'identifiant)</li>"
                +"<li><b>Mot de passe : </b>[celui que vous avez rentré sur le site]</li>"
                +"<li><b>Url : </b>"+url+"</li>"
        +"</p>"
        +"<p>Je vous souhaite bon jeu avec Dorica.</p>"
        +"<p style=\"margin-left: 50%;\">Miss Ica</p>"
    }
    //#endregion
    
    //#region Mail User NewPassword
    static getMailUserNewpasswordSubject() : string {
        return "Votre nouveau mot de passe DoricAPI"
    }
    static getMailUserNewpasswordText(name: string, email: string, url: string, password: string) : string {
        return "Bonjour "+name
        +"\nCe mail vous est envoyé suite à votre demande d'un nouveau mot de passe sur l'API de Dorica."
        +"\nDoricAPI vous fournit des informations sur le système de jeu Dorica."
        +"\nRéférez-vous à la documentation Swagger pour intégrer l'API à votre application"
        +"\nLien de DoricAPI : http://www.api.dorica.miss-ica.be"
        +"\nVos données sont :"
            +"\n\tNom : "+name
            +"\n\tEmail : "+email+" (votre email sert également d'identifiant)"
            +"\n\tMot de passe : "+password+"Modifiez votre mot de passe lors de votre prochaine connexion"
            +"\n\tUrl : "+url
        +"\nJe vous souhaite bon jeu avec Dorica."
            +"\n\tMiss Ica"
    }
    static getMailUserNewpasswordHtml(name: string, email: string, url: string, password: string) : string {
        return "<h1>Bonjour "+name+"!</h1>"
        +"<p>Ce mail vous est envoyé suite à votre demande d'un nouveau mot de passe sur l'API de Dorica.</p>"
        +"<p>DoricAPI vous fournit des informations sur le système de jeu Dorica."
            +"<br/>Référez-vous à la documentation Swagger pour intégrer l'API à votre application"
            +"<br/>Lien de DoricAPI : <a href=\"http://www.api.dorica.miss-ica.be\">www.api.dorica.miss-ica.be</a></p>"
        +"<p>Vos données sont :"
            +"<ul>"
                +"<li><b>Nom : </b>"+name+"</li>"
                +"<li><b>Email : </b>"+email+" (votre email sert également d'identifiant)</li>"
                +"<li><b>Mot de passe : </b>"+password+" <u style=\"color: red;\">Modifiez votre mot de passe lors de votre prochaine connexion</u></li>"
                +"<li><b>Url : </b>"+url+"</li>"
        +"</p>"
        +"<p>Je vous souhaite bon jeu avec Dorica.</p>"
        +"<p style=\"margin-left: 50%;\">Miss Ica</p>"
    }
    //#endregion
}