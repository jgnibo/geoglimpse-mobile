import { configureStore } from '@reduxjs/toolkit';

import placesReducer from './placesSlice';
import userReducer from './userSlice';
import locationReducer from './locationSlice';

const store = configureStore({
  reducer: {
    places: placesReducer,
    user: userReducer,
    location: locationReducer,
  },
});

export default store;
