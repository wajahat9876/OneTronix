export interface ICurrencyData {
  _id: string;
  currency: string;
  buying: number;
  selling: number;
  updatedAt: string;
  id: string;
}
export interface IConfigState {
  deviceType: string;
  pushToken?: string;
  deviceModal: string | null;
  locale: string;
  language: string;
  currency: string;
  currencyData: ICurrencyData | null;
  currencyAccount: string;
  localeSetDate: Date | null;
  recentlyDeleted: boolean;
  isBottomTabBarVisible: boolean;
  locationData: {
    data: any;
    setDate: Date | null;
  } | null;
  pushNotificationDisabled: boolean;
  deviceId: string | null;
  isSignupDone: boolean;
  tempDeviceId: string | null;
  appTutorialProgress: {
    appStartTutorialDone: boolean;
    accountTutorialDone: boolean;
    cardTutorialDone: boolean;
    currentTutorial: string | null;
    currentStep: number | null | undefined;
  };
  isNetworkConnected: boolean;
}
