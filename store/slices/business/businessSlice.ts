/* eslint-disable import/order */
/* eslint-disable no-param-reassign */
import { businessAuthApi } from "@/store/api/business/authApis";
import { businessCurrentApi } from "@/store/api/business/businessCurrent";
import { businessMainApi } from "@/store/api/business/mainApis";
import {
  businessPayee,
  inverterData,
  LastSelectBenefDetails,
  OutgoingTransfer,
  VerifySignIn,
} from "@/store/types/business/api_responses/auth";
import {
  DEMO_AUTH_TOKEN,
  DEMO_BUSINESS_USER,
} from "@utils/demo";
import { createSlice } from "@reduxjs/toolkit";

export interface IBusinessState {
  businessEmail?: string;
  businessPhone?: string;
  tempToken: string;
  auth_token: string | undefined;
  packageId: string;
  businessCategory: string;
  businessType: number | undefined;
  data: VerifySignIn;
  businessKycUrl: string;
  beneficiaryDetails: businessPayee;
  selectedBenefBankDetails: any[];
  getBusinessBeneficiary: any[];
  lastSelectedBusinessBenefDetails: LastSelectBenefDetails;
  businessBeneficiaryId?: string;
  signInBusinessEmail?: string;
  outgoingBusReduxData?: OutgoingTransfer;
  isInternal?: boolean;
  showIbanAccountToggle?: boolean;
  deviceId: string | undefined;
  role: boolean;
  inverterData?: inverterData;
  isVerifiedEmail?: boolean;
  isDarkMode?: boolean;
  currentPassword?: string;
  lastSelectedDeviceData?: {
    battery?: {
      chargingAmp?: number;
      floatToCutOff?: number;
      floating?: number;
      full?: number;
      fullToFloat?: number;
      low?: number;
      typeOfBattery?: string;
    };
    chargingSource?: { type: string };
    heavyLoad?: {
      offTime?: number;
      onTime?: number;
      offLevel?: number;
      onLevel?: number;
    };
    inverter?: {
      overLoad?: number;
      outputVoltLevel?: number;
      nominalFreq?: number;
      powerFactor?: number;
      syncMode?: string;
    };
    misc?: {
      buzzer?: boolean;
      lcdBacklight?: boolean;
      softStart?: boolean;
    };
    solar?: {
      highVolts?: number;
      lowVolts?: number;
      mpptTrackSpeed?: number;
    };
    utility?: {
      overVolts?: number;
      underVolts?: number;
      antiIslanding?: boolean;
      exportEnabled?: boolean;
      maxExportPower?: number;
      overFreq?: number;
      phaseSync?: boolean;
      underFreq?: number;
    };
    utilityControl?: {
      cutOffTime?: number;
      enabled?: boolean;
      offLevel?: number;
      onLevel?: number;
    };
  };
  lastSelectedDeviceId?: string;
}
const initialState: IBusinessState = {
  role: false,
  showIbanAccountToggle: false,
  businessEmail: "",
  isInternal: true,
  outgoingBusReduxData: { amount: "", transferReasonId: "", description: "" },
  signInBusinessEmail: "",
  businessPhone: "",
  isDarkMode: false,
  selectedBenefBankDetails: [],
  currentPassword: "",
  lastSelectedBusinessBenefDetails: {
    isFirstTransfer: false,
    accountNumber: "",
    beneficiaryId: "",
    iban: "",
    country: "",
    currency: "",
    id: "",
    _id: "",
    bankName: "",
    routingCodes: {
      "sort-code": "",
      aba: "",
      bic: "",
    },
  },
  getBusinessBeneficiary: [],
  tempToken: "",
  auth_token: "",
  deviceId: "",
  packageId: "",
  businessCategory: "",
  businessType: undefined,
  businessKycUrl: "",
  beneficiaryDetails: {
    accountNumber: "",
    iban: "",
    currency: "",
    Amount: "",
    creditorName: "",
    reference: "",
    accountNo: "",
    sortCode: "",
    name: "",
    payeeName: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    postCode: "",
    country: "",
    agentCountry: "",
    bic: "",
    agentName: "",
    _id: "",
  },
  lastSelectedDeviceData: {
    battery: {
      chargingAmp: 0,
      floatToCutOff: 0,
      floating: 0,
      full: 0,
      fullToFloat: 0,
      low: 0,
      typeOfBattery: "",
    },
    chargingSource: {
      type: "",
    },
    heavyLoad: {
      offTime: 0,
      onTime: 0,
      offLevel: 0,
      onLevel: 0,
    },
    inverter: {
      overLoad: 0,
      outputVoltLevel: 0,
      nominalFreq: 0,
      powerFactor: 0,
      syncMode: "",
    },
    misc: {
      buzzer: false,
      lcdBacklight: false,
      softStart: false,
    },
    solar: {
      highVolts: 0,
      lowVolts: 0,
      mpptTrackSpeed: 0,
    },
    utility: {
      overVolts: 0,
      underVolts: 0,
      antiIslanding: false,
      exportEnabled: false,
      maxExportPower: 0,
      overFreq: 0,
      phaseSync: false,
      underFreq: 0,
    },
    utilityControl: {
      cutOffTime: 0,
      enabled: false,
      offLevel: 0,
      onLevel: 0,
    },
  },
  lastSelectedDeviceId: "",
  data: {
    isVerified: false,
    auth_token: "",
    email: "",
    firstName: "",
    isBlocked: false,
    lastName: "",
    devices: [],
    _id: "",
    notificationCount: 0,
    activeDevice: {
      _id: "",
      deviceId: "",
      isActive: false,
      name: "",
      model: "",
      type: "",
    },
  },
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setPackageId(state, action) {
      state.packageId = action.payload;
    },
    setLastSelectedDevice(state, action) {
      state.lastSelectedDeviceData = action.payload;
    },
    setLastSelectedDeviceId(state, action) {
      state.lastSelectedDeviceId = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setIsInternal(state, action) {
      state.isInternal = action.payload;
    },
    setShowToogle(state, action) {
      state.showIbanAccountToggle = action.payload;
    },
    setSigninBusinessEmail(state, action) {
      state.signInBusinessEmail = action.payload;
    },

    businessQrSignin: (state, action) => {
      state.deviceId = action.payload;
    },
    setBusinessKycUrl(state, action) {
      state.businessKycUrl = action.payload.Url;
    },
    setDarkMode(state, action) {
      state.isDarkMode = action.payload;
    },
    resetPackageId(state) {
      state.packageId = "";
    },
    resetBusinessTempToken(state) {
      state.tempToken = "";
    },
    setCurrentPassword(state, action) {
      state.currentPassword = action.payload;
    },
    setBusinessCategory(state, action) {
      state.businessCategory = action.payload;
    },
    lastSelectedBeneficiaryDetails(state, action) {
      state.lastSelectedBusinessBenefDetails = action.payload;
    },
    setBusinessType(state, action) {
      state.businessType = action.payload;
    },
    setBeneficiaryDetails(state, action) {
      state.beneficiaryDetails = action.payload;
    },
    resetBeneficiaryBankDetails(state) {
      state.selectedBenefBankDetails = initialState.selectedBenefBankDetails;
    },
    setBeneficiaryId(state, action) {
      state.businessBeneficiaryId = action.payload;
    },

    setDemoSession(state: IBusinessState) {
      state.auth_token = DEMO_AUTH_TOKEN;
      state.isVerifiedEmail = true;
      state.data = DEMO_BUSINESS_USER;
    },

    businessLogout(state: IBusinessState) {
      console.log("Business Logout");
      state.role = false;
      state.auth_token = "";
      state.tempToken = "";
      state.signInBusinessEmail = "";
      state.data = initialState.data;
      state.packageId = "";
      state.businessType = undefined;
      state.businessKycUrl = initialState.businessKycUrl;
      state.deviceId = "";
      state.inverterData = initialState.inverterData;
      state.isVerifiedEmail = initialState.isVerifiedEmail;
      state.isDarkMode = initialState.isDarkMode;
      state.lastSelectedDeviceData = initialState.lastSelectedDeviceData;
      state.lastSelectedDeviceId = "";
      state.currentPassword = "";

      // console.log('businessLogout', state);
    },

    // setBusinessPassCode(state, action) {
    //   state.businessReduxPassCode = action.payload;
    // },
  },
  extraReducers(builder) {
    builder.addMatcher(
      businessAuthApi.endpoints.businessManualSignup.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.results?.token;
        state.deviceId = payload.results?.linkedDeviceId;
      }
    );
    builder.addMatcher(
      businessCurrentApi.endpoints.getCurrentBusiness.matchFulfilled,
      (state, { payload }) => {
        state.data = payload.results;
      }
    );
    builder.addMatcher(
      businessAuthApi.endpoints.businessSignupInstaller.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.results?.token;
      }
    );
    builder.addMatcher(
      businessAuthApi.endpoints.forgotPasswordEmail.matchFulfilled,
      (state, { payload }) => {
        state.tempToken = payload.results?.token;
      }
    );
    builder.addMatcher(
      businessAuthApi.endpoints.verifyForgotPasswordEmail.matchFulfilled,
      (state, { payload }) => {
        state.tempToken = payload.results?.token;
      }
    );
    builder.addMatcher(
      businessMainApi.endpoints.getInverterData.matchFulfilled,
      (state, { payload }) => {
        state.inverterData = payload?.results;
      }
    );
    builder.addMatcher(
      businessAuthApi.endpoints.businessSignin.matchFulfilled,
      (state, { payload }) => {
        console.log(payload, "businessSignin");
        state.auth_token = payload.results?.token;
        state.isVerifiedEmail = payload.results?.user?.isVerified;
        console.log(payload.results?.user?.isVerified, "state.data.isVerified");
      }
    );
    builder.addMatcher(
      businessAuthApi.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        console.log(payload, "businessSignin");
        state.auth_token = payload.results?.token;
      }
    );

    builder.addMatcher(
      businessAuthApi.endpoints.buisnessSignout.matchFulfilled,
      (state) => {
        console.log("Business Signout");
        state.auth_token = "";
        state.data = initialState.data;
      }
    );

    // builder.addMatcher(
    //   businessAuthApi.endpoints.forgotBusinessPasswordEmail.matchFulfilled,
    //   (state, { payload }) => {
    //     state.auth_token = payload.results?.auth_token;
    //   },
    // );

    // builder.addMatcher(
    //   businessAuthApi.endpoints.resetBusinessPassword.matchFulfilled,
    //   state => {
    //     state.auth_token = '';
    //   },
    // );
  },
});

export const {
  setCurrentPassword,
  setDemoSession,
  setLastSelectedDevice,
  setLastSelectedDeviceId,
  setPackageId,
  resetPackageId,
  setDarkMode,
  setBusinessCategory,
  setBusinessType,
  businessLogout,
  setIsInternal,
  setBusinessKycUrl,
  resetBusinessTempToken,
  setBeneficiaryDetails,
  lastSelectedBeneficiaryDetails,
  resetBeneficiaryBankDetails,
  setBeneficiaryId,
  businessQrSignin,
  setSigninBusinessEmail,
  setRole,
  setShowToogle,
} = businessSlice.actions;
export default businessSlice.reducer;
