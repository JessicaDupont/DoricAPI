import * as bcrypt from 'bcrypt';

export class Crypt{
    static async compare(pass: string, hash: any) : Promise<boolean>{
      const match = await bcrypt.compare(pass, hash);
      return match ? true : false;
    }
    static async securePassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }
}