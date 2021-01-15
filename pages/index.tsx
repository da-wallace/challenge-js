import Message from '@components/Message';
import NewMessage from '@components/NewMessage';
import User from '@components/User';
import Cookies from 'js-cookie';
import React from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage, IUser } from 'types';

interface IIndexPageProps {
  messages: IMessage[];
  users: IUser[];
}

const IndexPage: React.FC<IIndexPageProps> = ({ messages, users }) => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [localMessages, setLocalMessages] = React.useState([...messages]);
  const [localUsers, setLocalUsers] = React.useState([...users]);
  const [socketClient, setSocketClient] = React.useState<Socket | null>(null);

  const token = Cookies.get('token');

  React.useEffect(() => {
    if (token) {
      fetch('/api/socketio').finally(() => {
        const socket = io('', {
          extraHeaders: { Authorization: token }
        } as any);

        socket.on('connect', () => {
          socket.emit('hello');
        });

        socket.on('hello', (data) => {
          const user = JSON.parse(data);
          setUser(user);
        });

        socket.on('newMessage', (data) => {
          const message = JSON.parse(data);
          setLocalMessages([...localMessages, message]);
        });

        socket.on('userOnline', (data) => {
          const user = JSON.parse(data);

          if (!localUsers.find((lu) => lu.id === user.id)) {
            setLocalUsers([...localUsers, user]);
          }
        });

        setSocketClient(socket);
      });
    }
  }, [token]);

  const handleSubmit = async (data: { content: string }) => {
    const response = await fetch('/api/messages', {
      method: 'post',
      body: JSON.stringify(data)
    }).then((response) => response.json());

    if (!response.error && socketClient) {
      socketClient.emit('newMessage', JSON.stringify(response.data));
      setLocalMessages([...localMessages, response.data]);
    }
  };

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="text-sm font-semibold mt-2">{user?.username}</div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Users</span>
              <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                {localUsers.length}
              </span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2 overflow-y-auto">
              {localUsers.map((user) => (
                <User user={user} key={user.id} onClick={() => null} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {localMessages.map((message) => (
                    <Message
                      message={message}
                      key={message.id}
                      isUser={message.user.id === user?.id}
                    />
                  ))}
                </div>
              </div>
            </div>
            <NewMessage onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  try {
    const messages = await fetch('http://localhost:3000/api/messages', {
      headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined
    }).then((res) => res.json());

    const users = await fetch('http://localhost:3000/api/users', {
      headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined
    }).then((res) => res.json());

    if (messages && !messages.error && users && !users.error) {
      return {
        props: {
          messages: messages.data,
          users: users.data
        }
      };
    }
  } catch (e) {
    // left blank to pass through
  }

  ctx.res.setHeader('location', '/login');
  ctx.res.statusCode = 302;
  return {
    props: {
      messages: [],
      users: []
    }
  };
}

export default IndexPage;
