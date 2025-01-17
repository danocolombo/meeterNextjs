import { IronSessionData } from '@/types/types';
import { getIronSession, IronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';

export function getIronSessionDefaultMaxAge(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<IronSession<IronSessionData>> {
    const COOKIE_NAME = 'meeter';

    const sessionOptions = {
        password: process.env.IRON_SESSION_PASSWORD!,
        cookieName: COOKIE_NAME,
        maxAge: process.env.IRON_SESSION_MAX_AGE,
    };
    return getIronSession<IronSessionData>(req, res, sessionOptions);
}
