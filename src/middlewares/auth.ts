import { NextApiRequest, NextApiResponse } from 'next';
import { decodeToken } from '../../lib/jwt';
import logger from '../../lib/logger';

const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.debug('Missing or invalid authorization header', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        if (res.status) res.status(401).json({ message: 'Missing or invalid authorization header' });
        return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = decodeToken(token);

    if (!decoded) {
        logger.debug('Invalid token', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        if (res.status) res.status(401).json({ message: 'Invalid token' });
        return next();
    }

    // Attach decoded JWT data to the request object
    // @ts-ignore
    req.user = decoded;

    // Call the next middleware or route handler
    next();
};

export default authMiddleware;