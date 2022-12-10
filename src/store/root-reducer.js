import { compbineReducers } from 'redux';
import { pairReducer } from './pair/pair.reducer';

export const rootReducer = compbineReducers({
  pair: pairReducer,
});
