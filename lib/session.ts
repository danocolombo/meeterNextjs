import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Define the session payload structure
export interface SessionPayload {
    userId: string;
    role?: string;
    expiresAt: Date;
}

// Encryption key from environment variable
const secretKey = process.env.SESSION_SECRET;

// Encode the secret key
const encodedKey = new TextEncoder().encode(secretKey);

// Encrypt session data
export async function createSession(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

// Decrypt and verify session
export async function getSession() {
    const cookie = cookies().get('session')?.value;

    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, encodedKey, {
            algorithms: ['HS256'],
        });

        return payload as SessionPayload;
    } catch (error) {
        return null;
    }
}

// Delete session
export async function deleteSession() {
    cookies().delete('session');
}
