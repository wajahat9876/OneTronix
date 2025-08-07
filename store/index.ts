import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import { businessAuthApi } from './api/business/authApis';
import { businessCurrentApi } from './api/business/businessCurrent';
import { businessMainApi } from './api/business/mainApis';
import { businessKycApi } from './api/kyc/businessKycApi';
import reduxStorage from './mmkv/mmkvStorage';
import { rootReducer } from './rootReducer';

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['business', 'config'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: false,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      businessCurrentApi.middleware,
      businessAuthApi.middleware,
      businessKycApi.middleware,
      businessMainApi.middleware,
    ]),
  enhancers: defaultEnhancers => [...defaultEnhancers, devToolsEnhancer()],
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
