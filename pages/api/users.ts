import auth from '@middleware/auth';
import models from '@models/index';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(auth)
  .get(async (req, res) => {
    const users = await models.users.findAndCountAll();
    res.json({ status: 'success', data: users.rows, total: users.count });
  });

export default handler;
