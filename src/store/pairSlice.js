import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePair: 'Select',
  granularity: 'Minutes',
};

export const pairSlice = createSlice({
  name: 'pairer',
  initialState,
  reducers: {
    setActivePair: (state, action) => {
      console.log(state);
      state.activePair = action.payload;
    },
    setGranularity: (state, action) => {
      state.granularity = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActivePair, setGranularity } = pairSlice.actions;

export default pairSlice.reducer;
