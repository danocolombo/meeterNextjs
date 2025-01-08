import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, setSession } from 'next-session';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res);

    if (req.method === 'POST') {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        session.token = token;
        await setSession(req, res, session);

        return res.status(200).json({ message: 'Token saved successfully' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
