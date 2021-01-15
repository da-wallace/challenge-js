import { authorize } from '@thream/socketio-jwt';
import { Server } from 'socket.io';
import { IUser } from 'types';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    const activeUsers: Record<number, IUser> = {};

    io.use(
      authorize({
        secret: process.env.JWT_KEY
      })
    );

    io.sockets.on('connection', async (socket) => {
      const user = socket.decodedToken;

      socket.on('event://hello', () => {
        socket.broadcast.emit('event://user-online', JSON.stringify(user));
        activeUsers[user.id] = user;
        socket.emit('event://active-users', JSON.stringify(activeUsers));
      });

      socket.on('event://send-message', (data) => {
        socket.broadcast.emit('event://new-message', data);
      });

      socket.on('disconnect', async () => {
        console.log('disconnect', user);
        socket.broadcast.emit('event://user-offline', JSON.stringify(user));
        delete activeUsers[user.id];
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default ioHandler;
