import auth from '@middleware/auth';
import models from '@models/index';
import getMetaData from '@utils/getMetaData';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

declare module 'next' {
  interface NextApiRequest {
    user: any;
  }
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(auth)
  .get(async (req, res) => {
    const { user } = req;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'Please login.'
      });
    }

    const data = await models.users.findByPk(user.id);

    return res.status(200).json({
      status: 'success',
      message: 'done',
      data: data
    });
  });

export default handler;
