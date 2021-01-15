import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'lib/rootReducer';

export const usersArray = (state: RootState) =>
  Object.keys(state.users.entities).map((k) => state.users.entities[k]);

export const activeUserSelector = createSelector(usersArray, (users) =>
  users.filter((u) => u.active)
);
export const inactiveUserSelector = createSelector(usersArray, (users) =>
  users.filter((u) => !u.active)
);
