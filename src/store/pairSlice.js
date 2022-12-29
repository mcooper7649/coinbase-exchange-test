import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePair: 'BTC-USD',
  granularity: 'Minutes',
  newOb: {
    bestAsk: null,
    bestBid: null,
    bestAskSize: null,
    bestBidSize: null,
    bids: [],
    asks: [],
    price: null,
  },
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
    setNewOb: (state, action) => {
      state.newOb = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActivePair, setGranularity, setNewOb } = pairSlice.actions;

export default pairSlice.reducer;
