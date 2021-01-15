import Message from '@components/Message';
import NewMessage from '@components/NewMessage';
import Sidebar from '@components/Sidebar';
import { messagesArray } from '@lib/selectors/messages';
import { createMessage, fetchMessages } from '@lib/slices/messages.slice';
import { fetchUsers } from '@lib/slices/users.slice';
import { WebSocketContext } from '@lib/webSocket';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IFetchResponse, IUser } from 'types';

interface IIndexPageProps {
  currentUser: IUser;
}

const IndexPage: React.FC<IIndexPageProps> = ({ currentUser }) => {
  const ws = React.useContext(WebSocketContext);
  const dispatch = useDispatch();
  const messages = useSelector(messagesArray);
  const messagesRef = React.createRef<HTMLDivElement | null>();

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
        <Sidebar currentUser={currentUser} />
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
