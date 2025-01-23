import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth();
    const roles = sessionClaims?.metadata.roles;
    return roles?.includes(role);
    //return sessionClaims?.metadata.role === role;
};

export const getSessionInfo = async () => {
    const { sessionClaims } = await auth();
    return { status: 200, sessionClaims };
};
