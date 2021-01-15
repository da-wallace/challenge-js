import { addMessage } from '@lib/slices/messages.slice';
import { addActiveUsers } from '@lib/slices/users.slice';
import Cookies from 'js-cookie';
import { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';

export const WebSocketContext = createContext(null);

export default function WebSocketProvider({ children }) {
  const dispatch = useDispatch();
  let socket: Socket;

  const token = Cookies.get('token');

  const sendMessage = (payload: any) => {
    console.log(payload);
    socket.emit('event://send-message', JSON.stringify(payload));
  };

  const ws: {
    socket: Socket;
    sendMessage: (any) => void;
  } = {
    socket,
    sendMessage
  };

  if (!socket && token) {
    fetch('/api/socketio').finally(() => {
      socket = io('', {
        extraHeaders: { Authorization: token }
      });

      socket.emit('event://hello');

      socket.on('event://new-message', (msg) => {
        const payload = JSON.parse(msg);
        dispatch(addMessage(payload));
      });

      socket.on('event://active-users', (msg) => {
        console.log(msg);
        const payload = JSON.parse(msg);

        const pArray = Object.keys(payload).map((k) => payload[k]);
        dispatch(addActiveUsers(pArray));
      });
    });
  }

  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
}
