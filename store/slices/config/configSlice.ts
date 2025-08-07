/* eslint-disable no-param-reassign */
import { IConfigState } from '@/store/types/Config';
// eslint-disable-next-line import/order
import { createSlice } from '@reduxjs/toolkit';

const initialState: IConfigState = {
  deviceModal: '',
  deviceType: '',
  pushToken: '',
  locale: 'CO',
  localeSetDate: null,
  language: 'en',
  currency: 'COP',
  currencyAccount: 'COP',
  currencyData: null,
  isNetworkConnected: true,
  recentlyDeleted: false,
  isBottomTabBarVisible: true,
  locationData: null,
  pushNotificationDisabled: false,
  deviceId: null,
  isSignupDone: false,
  tempDeviceId: null,
  appTutorialProgress: {
    appStartTutorialDone: false,
    accountTutorialDone: false,
    cardTutorialDone: false,
    currentTutorial: null,
    currentStep: null,
  },
};

export type TutorialDoneType =
  | 'appStartTutorialDone'
  | 'accountTutorialDone'
  | 'cardTutorialDone';

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setValue: (state: IConfigState, action) => {
      (state as any)[action.payload.type] = action.payload.value;
    },
    setModal: (state: IConfigState, action) => {
      state.deviceModal = action.payload.modal;
      state.deviceType = action.payload.type;
    },
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
    logoutPushToken: (state: IConfigState) => {
      state.pushToken = '';
      state.deviceId = null;
      state.deviceModal = '';
      state.deviceType = '';
    },
    setAppTutorialStep: (
      state: IConfigState,
      action: {
        payload: {
          currentTutorial: TutorialDoneType | null;
          currentStep: number | null | undefined;
          statuses?: {
            [key: string]: boolean;
          };
        };
      },
    ) => {
      state.appTutorialProgress.currentTutorial =
        action.payload.currentTutorial;
      state.appTutorialProgress.currentStep = action.payload.currentStep;
      if (action.payload.statuses) {
        state.appTutorialProgress = {
          ...state.appTutorialProgress,
          ...action.payload.statuses,
        };
      }
    },
    setAppTutorialProgress: (
      state: IConfigState,
      action: {
        payload: TutorialDoneType;
      },
    ) => {
      if (state.appTutorialProgress !== undefined) {
        state.appTutorialProgress[action.payload] = true;
        state.appTutorialProgress.currentTutorial = null;
        state.appTutorialProgress.currentStep = 0;
      } else {
        state.appTutorialProgress = {
          appStartTutorialDone: false,
          accountTutorialDone: false,
          cardTutorialDone: false,
          currentTutorial: null,
          currentStep: 0,
          [action.payload]: true,
        };
      }
    },
  },

  extraReducers() {
    // builder.addMatcher(
    //   configApi.endpoints.getCurrency.matchFulfilled,
    //   (state, { payload }) => {
    //     (state as any).currencyData = payload;
    //   },
    // );
  },
});

export const {
  setValue,
  setAppTutorialProgress,
  setAppTutorialStep,
  setModal,
  setPushToken,
  logoutPushToken,
} = configSlice.actions;

export default configSlice.reducer;
