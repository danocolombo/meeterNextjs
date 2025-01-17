import { getIronSessionDefaultMaxAge } from '@/utils/session';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const COOKIE_VALUE = req.body;
        const session = await getIronSessionDefaultMaxAge(req, res);
        session.apiToken = COOKIE_VALUE;
        await session.save(); // --- encrypt the session data and set cookie

        res.status(200).json({ message: 'Cookie set' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
