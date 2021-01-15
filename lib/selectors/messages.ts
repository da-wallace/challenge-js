import { RootState } from 'lib/rootReducer';

export const messagesArray = (state: RootState) =>
  Object.keys(state.messages.entities).map((k) => state.messages.entities[k]);
