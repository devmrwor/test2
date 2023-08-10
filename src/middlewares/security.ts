import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../lib/logger';

const contentSecurityPolicy = {
    useDefaults: true,
    directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https:'],
    },
};

const referrerPolicy = {
    policy: 'strict-origin-when-cross-origin',
};

const expectCt = {
    maxAge: 30,
    enforce: true,
};

const dnsPrefetchControl = {
    allow: false,
};

const noCache = {
    noEtag: true,
    noLastModified: true,
    mustRevalidate: true,
    cacheControl: false,
};

const contentSecurityPolicyReportOnly = {
    ...contentSecurityPolicy,
    reportOnly: true,
    setAllHeaders: false,
    disableAndroid: true,
};

// Configure rate limiter
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

const security = helmet({
    contentSecurityPolicy,
    //@ts-ignore
    referrerPolicy,
    expectCt,
    dnsPrefetchControl,
    noCache,
    contentSecurityPolicyReportOnly,
});

// Middleware function
export default async function securityMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    // Apply Helmet
    await new Promise<void>((resolve) => {
        security(req, res, (result: unknown) => {
            resolve(result as void);
        });
    });

    // Apply rate limiter
    await new Promise<void>((resolve, reject) => {
        rateLimiter(req, res, (result: unknown) => {
            if (res.statusCode === 429) {
                // Rate limit exceeded
                logger.error('Rate limit exceeded', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
                reject(new Error('Too many requests, please try again later.'));
            } else {
                resolve(result as void);
            }
        });
    });

    // Continue to the next middleware or route handler
    next();
};