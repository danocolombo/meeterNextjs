import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSessionDefaultMaxAge } from '@/utils/IRONSESSION';
import { IronSessionData } from '@/types/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    //* ------------------------------------------------
    //* set cookie for session
    //* ------------------------------------------------
    if (req.method === 'POST') {
        try {
            const { apiToken } = req.body;

            if (!apiToken) {
                return res.status(400).json({ error: 'apiToken is required' });
            }

            const session = await getIronSessionDefaultMaxAge(req, res);
            session.apiToken = apiToken;
            await session.save();

            return res
                .status(200)
                .json({ message: 'apiToken saved successfully' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
