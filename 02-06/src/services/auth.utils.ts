import { sign } from 'jsonwebtoken';
import config from 'config';

export function createToken(id: string): string {
    const key: string = config.get('JWT_KEY');
    const expiresIn: string = config.get('TOKEN_EXPIRATION');
    return sign({ id }, key, { expiresIn })
}

// TODO: add password hashing
export function validatePassword(password: string, hashedPassword: string): boolean {
    return password === hashedPassword;
}
