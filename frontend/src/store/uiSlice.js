import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
