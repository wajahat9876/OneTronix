/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export interface ISignInTypeState {
  signInType: string;
  index: number;
  isPinCodeAccepted?: boolean;
  isNetworkConnected?: boolean;
}

const initialState: ISignInTypeState = {
  signInType: 'Business',
  index: 0,
  isPinCodeAccepted: false,
  isNetworkConnected: false,
};

const signInTypeSlice = createSlice({
  name: 'signInType',
  initialState,
  reducers: {
    setIsPinCodeAccepted(state, action) {
      state.isPinCodeAccepted = action.payload;
    },
    setIsNetworkConnected(state, action) {
      state.isNetworkConnected = action.payload;
    },
    setSignInType(state, action) {
      state.signInType = action.payload.signInType;
      state.index = action.payload.index;
    },
    resetSignInType(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = {
        signInType: 'Business',
        index: 0,
      };
      console.log('redux Signintype', state);
    },
  },
});

export const {
  setSignInType,
  resetSignInType,
  setIsPinCodeAccepted,
  setIsNetworkConnected,
} = signInTypeSlice.actions;

export default signInTypeSlice.reducer;
