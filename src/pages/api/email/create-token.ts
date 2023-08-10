import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { IRequest } from '../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.post(async (req, res) => {
	const { email } = req.body;
	//FIXME: implement generate verification token and email sending

	try {
		if (email) {
			return res.status(200).json({ message: 'Token generated' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'failed_to_generate_verification_token' });
	}
});

export default handler;
