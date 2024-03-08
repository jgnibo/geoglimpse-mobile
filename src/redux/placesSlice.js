import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  places: [],
  status: 'uninitialized',
  error: null,
};

export const getViewablePlaces = createAsyncThunk(
  'places/getViewablePlaces',
  async (creatorId) => {
    try {
      const places = await placesApi.getViewablePlaces(creatorId);
      return places;
    } catch (error) {
      throw new Error(`Error getting viewable places: ${error}`)
    }
  }
);

export const getPublicPlaces = createAsyncThunk(
  'places/getPublicPlaces',
  async () => {
    try {
      const places = await placesApi.getPublicPlaces();
      return places;
    } catch (error) {
      throw new Error(`Error getting public places: ${error}`)
    }
  }
);

export const getAuthoredPlaces = createAsyncThunk(
  'places/getAuthoredPlaces',
  async (creatorId) => {
    try {
      const places = await placesApi.getAuthoredPlaces(creatorId);
      return places;
    } catch (error) {
      throw new Error(`Error getting authored places: ${error}`)
    }
  }
);

export const createPlace = createAsyncThunk(
  'places/createPlace',
  async (placeData) => {
    try {
      const place = await placesApi.createPlace(placeData);
      return place;
    } catch (error) {
      throw new Error(`Error creating place: ${error}`)
    }
  }
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getViewablePlaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getViewablePlaces.fulfilled, (state, action) => {
        state.status = 'idle';
        state.places = action.payload;
      })
      .addCase(getViewablePlaces.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(getPublicPlaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPublicPlaces.fulfilled, (state, action) => {
        state.status = 'idle';
        state.places = action.payload;
      })
      .addCase(getPublicPlaces.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(getAuthoredPlaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAuthoredPlaces.fulfilled, (state, action) => {
        state.status = 'idle';
        state.places = action.payload;
      })
      .addCase(getAuthoredPlaces.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(createPlace.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.status = 'idle';
        state.places.push(action.payload);
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      });
  }
})
