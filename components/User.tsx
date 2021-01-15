import React from 'react';
import { IUser } from 'types';

interface IUserProps {
  user: IUser;
  onClick: (username: string) => void;
}

const User: React.FC<IUserProps> = ({ onClick, user }) => {
  return (
    <button
      className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
      onClick={() => onClick(user.username)}>
      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
        {user.username.substring(0, 1).toUpperCase()}
      </div>
      <div className="ml-2 text-sm font-semibold">{user.username}</div>
    </button>
  );
};

export default User;
