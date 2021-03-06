import { fetchMessageMetadata } from '@lib/slices/messages.slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { IMessage } from 'types';

interface IMessageProps {
  message: IMessage;
  isUser: boolean;
}

const Nav: React.FC<IMessageProps> = ({ message, isUser }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = message.content.match(urlRegex);

    if (matches?.length && !message.metadata?.length) {
      dispatch(
        fetchMessageMetadata({
          messageId: message.id,
          content: message.content
        })
      );
    }
  }, [message]);

  const hasMetaData = !!message.metadata?.length;

  const contentWithTags = message.content.replace(/(?!\b)@(?:\w+)/g, function (tag) {
    return '<span class="mr-1 font-bold text-sm">' + tag + '</span>';
  });

  const httpsOnly = (url: string) => {
    return url.replace('http://', 'https://');
  };

  return (
    <>
      <div
        className={`${
          isUser ? 'col-start-6 col-end-13' : 'col-start-1 col-end-8'
        }  p-3 rounded-lg`}>
        <div
          className={`flex flex-row items-center ${
            isUser ? 'justify-start flex-row-reverse' : ''
          }`}>
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
            {message.user.username.substring(0, 1).toUpperCase()}
          </div>
          <div
            className={`relative text-sm bg-${
              isUser ? 'indigo-100 mr-3' : 'white ml-3'
            } py-2 px-2 shadow rounded-xl`}>
            <div>
              {hasMetaData ? (
                message.metadata.map((data) => (
                  <div key={data.id}>
                    {data.image && (
                      <img className="w-full" src={httpsOnly(data.image)} alt={data.title} />
                    )}
                    <div className="px-0 py-4">
                      <div className="font-bold text-md mb-2">{data.title}</div>
                      <p className="text-grey-darker text-sm">{data.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div dangerouslySetInnerHTML={{ __html: contentWithTags }}></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
