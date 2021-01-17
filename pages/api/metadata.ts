import getMetaData from '@lib/getMetaData';
import auth from '@middleware/auth';
import models from '@models/index';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(auth)
  .post(async (req, res) => {
    const { content, messageId } = JSON.parse(req.body);
    if (!content || !content.length) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter a url.'
      });
    }

    if (!messageId) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter a messageId.'
      });
    }

    const { user } = req;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'Please login.'
      });
    }

    const metadata = await getMetaData(content);

    const data = [];

    for (const m of metadata) {
      const newMetaData = await models.metadata.create({
        description: m.description,
        icon: m.icon,
        image: m.image,
        title: m.title,
        keywords: JSON.stringify(m.keywords),
        provider: m.provider,
        type: m.type,
        url: m.url,
        messageId
      });

      data.push(newMetaData);
    }

    return res.status(200).json({
      status: 'success',
      message: 'done',
      data
    });
  });

export default handler;
