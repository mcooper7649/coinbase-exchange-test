import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePair: 'Select',
  granularity: 'Minutes',
  aggregate: 0.5,
  activeGranularity: 'Granularity',
};

export const pairSlice = createSlice({
  name: 'pairer',
  initialState,
  reducers: {
    setActivePair: (state, action) => {
      // console.log(state);
      state.activePair = action.payload;
    },
    setGranularity: (state, action) => {
      state.granularity = action.payload;
    },
    setAggregate: (state, action) => {
      state.aggregate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActivePair, setGranularity, setAggregate } =
  pairSlice.actions;

export default pairSlice.reducer;
