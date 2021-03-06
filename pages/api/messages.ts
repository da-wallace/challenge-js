import getMetaData from '@lib/getMetaData';
import auth from '@middleware/auth';
import models from '@models/index';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(auth)
  .get(async (req, res) => {
    const messages = await models.messages.findAndCountAll({
      include: [models.metadata, models.users]
    });
    res.json({ status: 'success', data: messages.rows, total: messages.count });
  })
  .post(async (req, res) => {
    const { content } = JSON.parse(req.body);
    if (!content || !content.length) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter content.'
      });
    }

    const { user } = req;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'Please login.'
      });
    }

    const newMessage = await models.messages.create({
      content,
      userId: user.id
    });

    return res.status(200).json({
      status: 'success',
      message: 'done',
      data: {
        ...newMessage.toJSON(),
        user
      }
    });
  });
export default handler;
