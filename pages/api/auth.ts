import models from '@models/index';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const KEY = process.env.JWT_KEY;

const handler = nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
  const { username } = JSON.parse(req.body);
  if (!username) {
    return res.status(400).json({
      status: 'error',
      error: 'Please enter a username.'
    });
  }
  let user = await models.users.findOne({
    where: { username },
    attributes: ['id', 'username'],
    limit: 1
  });

  if (!user) {
    user = await models.users.create({
      username
    });
  }

  const payload = user.toJSON();

  jwt.sign(
    payload,
    KEY,
    {
      expiresIn: 31556926
    },
    (err, token) => {
      res.status(200).json({
        success: true,
        token: 'Bearer ' + token
      });
    }
  );
});
export default handler;
