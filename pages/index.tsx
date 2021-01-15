import Message from '@components/Message';
import NewMessage from '@components/NewMessage';
import User from '@components/User';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IFetchResponse, IUser } from 'types';

import { messagesArray } from '../lib/selectors/messages';
import { activeUserSelector, inactiveUserSelector } from '../lib/selectors/users';
import { createMessage, fetchMessages } from '../lib/slices/messages.slice';
import { fetchUsers } from '../lib/slices/users.slice';
import { WebSocketContext } from '../lib/webSocket';

interface IIndexPageProps {
  currentUser: IUser;
}

const IndexPage: React.FC<IIndexPageProps> = ({ currentUser }) => {
  const ws = React.useContext(WebSocketContext);
  const dispatch = useDispatch();
  const activeUsers = useSelector(activeUserSelector);
  const inactiveUsers = useSelector(inactiveUserSelector);
  const messages = useSelector(messagesArray);
  const messagesRef = React.createRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchMessages());
  }, [dispatch]);

  React.useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messagesRef]);

  const handleSubmit = async (data: { content: string }) => {
    const message = await dispatch(createMessage(data));
    ws.sendMessage(message.payload.data);
  };

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="text-sm font-semibold mt-2">{currentUser?.username}</div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Active</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {activeUsers.length}
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                {activeUsers.map((user) => (
                  <User user={user} key={user.id} onClick={() => null} />
                ))}
              </div>
              <div className="flex flex-row items-center justify-between text-xs mt-6">
                <span className="font-bold">Inactive</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {inactiveUsers.length}
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2">
                {inactiveUsers.map((user) => (
                  <User user={user} key={user.id} onClick={() => null} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {messages.map((message) => (
                    <Message
                      message={message}
                      key={message.id}
                      isUser={message.user.id === currentUser?.id}
                    />
                  ))}
                  <div ref={messagesRef} />
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
  const currentUser = (await fetch('http://localhost:3000/api/current', {
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined
  }).then((res) => res.json())) as IFetchResponse<IUser>;

  if (!currentUser?.data) {
    ctx.res.setHeader('location', '/login');
    ctx.res.statusCode = 302;

    return {
      props: {
        currentUser: null
      }
    };
  } else {
    return {
      props: {
        currentUser: currentUser.data
      }
    };
  }
}

export default IndexPage;
