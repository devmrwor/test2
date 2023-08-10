import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { models } from '@lib/db';
import { Bcrypt } from '@/utils/bcrypt';
import securityMiddleware from '@/middlewares/security';
import { v4 as uuidv4 } from 'uuid';
import { getToken, sendVerificationEmail } from '@/controllers/email';
import { ApiEmailSubRoutes, EmailRoutes, Routes } from '../../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(securityMiddleware);

handler.post(async (req, res) => {
    const { password, token } = req.body;
    const trimmedPassword = password ? String(password).trim() : '';

    if (!token || trimmedPassword.length < 3) {
        return res.status(400).json({ message: 'invalid_token_or_password' });
    }

    try {
        const existingUser = await models.User.findOne({ where: { email_token: token } });

        if (!existingUser) {
            return res.status(404).json({ message: 'token_not_found_or_has_expired' });
        }

        const hashedPassword = await Bcrypt.hash(trimmedPassword, 10);

        existingUser.set('password_hash', hashedPassword);
        existingUser.set('email_token', null);

        await existingUser.save();

        res.status(200).json({
            message: 'User password changed'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error instanceof Error ? error.message : 'internal_server_error' });
    }
});

export default handler;
