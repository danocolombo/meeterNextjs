import NextCrypto from 'next-crypto';

const secretKey: string = process.env.SESSION_KEY || '';
const crypto = new NextCrypto(secretKey);

export async function encryptValue(value: string) {
    const encrypted = await crypto.encrypt(value);
    return encrypted;
}

export async function decryptValue(value: string) {
    const decrypted = await crypto.decrypt(value);
    return decrypted;
}
