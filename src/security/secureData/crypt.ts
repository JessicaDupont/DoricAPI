import * as bcrypt from 'bcrypt';

export class Crypt{
    static async securePassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }
}