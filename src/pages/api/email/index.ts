import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { IRequest } from '../../../../common/types/request';
import { verifyEmailToken } from '../../../controllers/email';

const handler = nc<IRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { email, token } = req.body;

  try {
    const isValidToken = await verifyEmailToken(email, token);
    console.log(isValidToken, 'isValidToken');
    if (isValidToken) {
      return res.status(200).json({ message: 'Email verified successfully.' });
    }
    return res.status(400).json({ message: 'Invalid or expired token.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while verifying the email' });
  }
});

export default handler;
