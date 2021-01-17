import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFetchResponse, IMessage, IMetaData } from 'types';

export const fetchMessages = createAsyncThunk<
  IFetchResponse<IMessage[]>,
  null,
  { rejectValue: IFetchResponse<null> }
>('messages/fetch', async (data, thunkApi) => {
  const response = await fetch(`/api/messages`);

  if (response.status !== 200) {
    // Return the known error for future handling
    return thunkApi.rejectWithValue(await response.json());
  }

  return response.json();
});

export const fetchMessageMetadata = createAsyncThunk<
  IFetchResponse<IMetaData[]>,
  { messageId: number; content: string },
  { rejectValue: IFetchResponse<null> }
>('metadata/fetch', async (data, thunkApi) => {
  const response = await fetch(`/api/metadata`, {
    method: 'post',
    body: JSON.stringify(data)
  });

  if (response.status !== 200) {
    // Return the known error for future handling
    return thunkApi.rejectWithValue(await response.json());
  }

  return response.json();
});

export const createMessage = createAsyncThunk<
  IFetchResponse<IMessage>,
  { content: string },
  { rejectValue: IFetchResponse<null> }
>('messages/new', async (data, thunkApi) => {
  const response = await fetch('/api/messages', {
    method: 'post',
    body: JSON.stringify(data)
  });

  if (response.status !== 200) {
    // Return the known error for future handling
    return thunkApi.rejectWithValue(await response.json());
  }

  return response.json();
});

interface MessagesState {
  entities: Record<number, IMessage>;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error?: string;
}

const initialState = {
  entities: {},
  loading: 'idle',
  error: null
} as MessagesState;

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.entities[action.payload.id] = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = 'pending';
      state.entities = {};
    });
    builder.addCase(fetchMessages.fulfilled, (state, { payload }) => {
      state.loading = 'succeeded';

      if (payload.data) {
        payload.data.forEach((d) => {
          state.entities[d.id] = d;
        });
      }
    });
    builder.addCase(fetchMessages.rejected, (state, { payload }) => {
      state.loading = 'failed';
      state.error = payload.error || '';
    });
    builder.addCase(createMessage.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createMessage.fulfilled, (state, { payload }) => {
      state.loading = 'succeeded';
      if (payload.data) {
        state.entities[payload.data.id] = payload.data;
      }
    });
    builder.addCase(createMessage.rejected, (state, { payload }) => {
      state.loading = 'failed';
      state.error = payload.error || '';
    });
    builder.addCase(fetchMessageMetadata.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchMessageMetadata.fulfilled, (state, { payload }) => {
      state.loading = 'succeeded';
      if (payload.data) {
        state.entities[payload.data[0].messageId] = {
          ...state.entities[payload.data[0].messageId],
          metadata: payload.data
        };
      }
    });
    builder.addCase(fetchMessageMetadata.rejected, (state, { payload }) => {
      state.loading = 'failed';
      state.error = payload.error || '';
    });
  }
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
