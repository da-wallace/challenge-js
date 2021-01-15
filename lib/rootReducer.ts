import { combineReducers } from '@reduxjs/toolkit';

import messages from './slices/messages.slice';
import users from './slices/users.slice';

const rootReducer = combineReducers({ users, messages });
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
