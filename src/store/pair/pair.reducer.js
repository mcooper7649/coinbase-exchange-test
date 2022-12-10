export const PAIR_ACTION_TYPES = {
  SET_CURRENT_PAIR: 'SET_CURRENT_PAIR',
};

const INITIAL_STATE = {
  currentPair: null,
};

export const pairReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case PAIR_ACTION_TYPES.SET_CURRENT_PAIR:
      return { ...state, currentPair: payload };
    default:
      return state;
  }
};
