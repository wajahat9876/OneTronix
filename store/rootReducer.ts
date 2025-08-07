import { combineReducers } from '@reduxjs/toolkit';
import { businessAuthApi } from './api/business/authApis';
import { businessCurrentApi } from './api/business/businessCurrent';
import { businessMainApi } from './api/business/mainApis';
import { businessKycApi } from './api/kyc/businessKycApi';
import businessSlice from './slices/business/businessSlice';
import signInTypeSlice from './slices/common/signInTypeSlice';
import configSlice from './slices/config/configSlice';

// eslint-disable-next-line import/prefer-default-export
export const rootReducer = combineReducers({
  // commong reducers
  signInType: signInTypeSlice,

  // business reducers
  business: businessSlice,
  [businessCurrentApi.reducerPath]: businessCurrentApi.reducer,
  [businessAuthApi.reducerPath]: businessAuthApi.reducer,
  [businessKycApi.reducerPath]: businessKycApi.reducer,
  [businessMainApi.reducerPath]: businessMainApi.reducer,

  config: configSlice,
});
