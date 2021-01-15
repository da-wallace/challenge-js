import nextConnect from 'next-connect';

import { verifyToken } from './utils';

const middleware = nextConnect();

const restricted = ['/api/messages'];

export default middleware.use(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies.token || '';
  let user = {};

  console.log(authHeader);

  if (!restricted.includes(req.url) && !authHeader) {
    return next();
  }
  if (authHeader) {
    const sessionID = authHeader.split(' ')[1];
    if (sessionID) {
      user = verifyToken(sessionID);
      if (user) {
        req.user = user;
      } else {
        res.statusCode = 401;
        return res.send({
          status: 'error',
          error: 'Expired'
        });
      }
    } else {
      res.statusCode = 401;
      return res.send({
        status: 'error',
        error: 'Wrong Token'
      });
    }
  } else {
    res.statusCode = 401;
    return res.send({
      status: 'error',
      error: 'Unauthorized'
    });
  }
  return next();
});
