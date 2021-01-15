import User from '@components/User';
import { activeUserSelector, inactiveUserSelector } from '@lib/selectors/users';
import { useSelector } from 'react-redux';
import { IUser } from 'types';

const Sidebar: React.FC<{ currentUser: IUser }> = ({ currentUser }) => {
  const activeUsers = useSelector(activeUserSelector);
  const inactiveUsers = useSelector(inactiveUserSelector);

  return (
    <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
      <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
        <div className="text-sm font-semibold mt-2">{currentUser?.username}</div>
      </div>
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
  );
};

export default Sidebar;
