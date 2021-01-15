import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFetchResponse, IUser } from 'types';

export const fetchUsers = createAsyncThunk<
  IFetchResponse<IUser[]>,
  null,
  { rejectValue: IFetchResponse<null> }
>(
  'api/users/fetchUsers',
  // if you type your function argument here
  async (data, thunkApi) => {
    const response = await fetch(`/api/users`);

    if (response.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(await response.json());
    }

    return await response.json();
  }
);

interface UsersState {
  entities: Record<number, IUser>;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState = {
  entities: {},
  loading: 'idle'
} as UsersState;

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addActiveUsers: (state, action: PayloadAction<IUser[]>) => {
      action.payload.forEach((d) => {
        state.entities[d.id] = {
          ...d,
          active: true
        };
      });
    },
    removeActiveUser: (state, action: PayloadAction<IUser>) => {
      state.entities[action.payload.id] = {
        ...action.payload,
        active: false
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = 'pending';
      state.entities = [];
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.loading = 'succeeded';
      if (payload.data) {
        payload.data.forEach((d) => {
          state.entities[d.id] = d;
        });
      }
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.loading = 'failed';
    });
  }
});

export const { addActiveUsers, removeActiveUser } = usersSlice.actions;

export default usersSlice.reducer;
