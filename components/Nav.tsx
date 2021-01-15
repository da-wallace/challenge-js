import React from 'react';

interface INavProps {
  username: string;
}

const Nav: React.FC<INavProps> = ({ username }) => {
  return (
    <div
      className="fixed w-full bg-gray-100 h-16 text-white flex justify-center items-center shadow-md"
      style={{ top: 0, overscrollBehavior: 'none' }}>
      <div className="text-black font-bold text-lg tracking-wide">@{username}</div>
    </div>
  );
};

export default Nav;
