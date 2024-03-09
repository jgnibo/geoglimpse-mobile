/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../requests/userApi';

const initialState = {
  user: null,
  viewingUser: null,
  status: 'uninitialized',
  error: null,
};

// THIS SHOULD ONLY BE USED IN TESTING - PRIOR TO AUTH
export const login = createAsyncThunk(
  'user/getUserByUsername',
  async (username) => {
    console.log('WHAT THE FUCK', username);
    try {
      const user = await userApi.getUserByUsername(username);
      return user;
    } catch (error) {
      throw new Error(`Error getting user by username: ${error}`);
    }
  },
);

// Don't need to worry about param reassign coming from eslint cause slice uses immer
const userSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    selectPlace: (state, action) => {
      state.selectedPlace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
