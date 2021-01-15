import { authorize } from '@thream/socketio-jwt';
import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.use(
      authorize({
        secret: process.env.JWT_KEY
      })
    );

    io.sockets.on('connection', async (socket) => {
      socket.on('hello', () => {
        socket.broadcast.emit('userOnline', JSON.stringify(socket.decodedToken));
        socket.emit('hello', JSON.stringify(socket.decodedToken));
      });

      socket.on('newMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
      });

      socket.on('disconnect', async (socket) => {
        socket.broadcast.emit('userOffline', JSON.stringify(socket.decodedToken));
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
