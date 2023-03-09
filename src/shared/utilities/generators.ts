export class Generators {
    static getNumber(min: number, max: number, word: string=null): number {
        let result = 0;
        let possibilities = max - min;
        console.log("possibilities : "+possibilities+" / result : "+(result % possibilities));
        if (word) {
            for (let i = 0; i < word.length; i++) {
                result += word.charCodeAt(i);
                console.log("i="+i+" : "+result);
            }
            result =  (result % possibilities) + min;
        } else {
            result = Math.floor((Math.random() * possibilities) + min)
        }
        return result;
    }
}