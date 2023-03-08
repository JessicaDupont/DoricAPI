export class Messages{
    //#region Mail Register
    static getMailRegisterSubject() : string { 
        return "Votre inscription à DoricAPI";
    }
    static getMailRegisterText(name: string, email: string, url: string) : string {
        return "Bonjour "+name
            +"\nCe mail vous est envoyé suite à votre inscription sur l'API de Dorica."
            +"\nDoricAPI vous fournit des informations sur le système de jeu Dorica."
            +"\nRéférez-vous à la documentation Swagger pour intégrer l'API à votre application"
            +"\nLien de DoricAPI : http://www.api.dorica.miss-ica.be"
            +"\nVos données sont :"
            +"\n\tNom : "+name
            +"\n\tEmail : "+email+" (votre email sert également d'identifiant)"
            +"\n\tMot de passe : [celui que vous avez rentré sur le site]"
            +"\n\tUrl : "+url
            +"\nJe vous souhaite bon jeu avec Dorica."
            +"\nMiss Ica"
    }
    static getMailRegisterHtml(name: string, email: string, url: string) : string {
        return "<h1>Bonjour "+name+"!</h1>"
        +"<p>Ce mail vous est envoyé suite à votre inscription sur l'API de Dorica.</p>"
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
    
    //#region Mail NewPassword
    static getMailNewpasswordSubject() : string {
        return "Votre nouveau mot de passe DoricAPI"
    }
    static getMailNewpasswordText(name: string, email: string, url: string, password: string) : string {
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
    static getMailNewpasswordHtml(name: string, email: string, url: string, password: string) : string {
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