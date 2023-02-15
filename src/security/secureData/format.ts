export class Format{
    static validateEmail(email){
        let result = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
        return result;
    }
}