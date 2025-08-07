/* eslint-disable import/order */
/* eslint-disable no-param-reassign */
import { businessAuthApi } from '@/store/api/business/authApis';
import { businessCurrentApi } from '@/store/api/business/businessCurrent';
import { businessMainApi } from '@/store/api/business/mainApis';
import { businessKycApi } from '@/store/api/kyc/businessKycApi';
import {
  businessPayee,
  LastSelectBenefDetails,
  OutgoingTransfer,
  QuotesBusiness,
  VerifySignIn,
} from '@/store/types/business/api_responses/auth';
import { createSlice } from '@reduxjs/toolkit';

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
  businessReduxPassCode: string;
  beneficiaryDetails: businessPayee;
  selectedBenefBankDetails: any[];
  getBusinessBeneficiary: any[];
  lastSelectedBusinessBenefDetails: LastSelectBenefDetails;
  businessBeneficiaryId?: string;
  quoteDetails?: QuotesBusiness;
  signInBusinessEmail?: string;
  outgoingBusReduxData?: OutgoingTransfer;
  isInternal?: boolean;
  showIbanAccountToggle?: boolean;
}
const initialState: IBusinessState = {
  showIbanAccountToggle: false,
  businessEmail: '',
  isInternal: true,
  outgoingBusReduxData: { amount: '', transferReasonId: '', description: '' },
  signInBusinessEmail: '',
  businessPhone: '',
  quoteDetails: {
    fee: 0,
    buyAmount: 0,
    buyCurrency: '',
    createdAt: '',
    currencyPair: '',
    exchangeRate: 0,
    expiresAt: '',
    marginAmount: 0,
    marginCurrency: '',
    quoteId: '',
    quoteRequest: {
      buyCurrency: '',
      fixedSide: '',
      instructedAmount: 0,
      margin: 0,
      sellCurrency: '',
      valueDate: '',
    },
    sellAmount: 0,
    sellCurrency: '',
    valueDate: '',
  },
  businessReduxPassCode: '',
  selectedBenefBankDetails: [],
  lastSelectedBusinessBenefDetails: {
    isFirstTransfer: false,
    accountNumber: '',
    beneficiaryId: '',
    iban: '',
    country: '',
    currency: '',
    id: '',
    _id: '',
    bankName: '',
    routingCodes: {
      'sort-code': '',
      aba: '',
      bic: '',
    },
  },
  getBusinessBeneficiary: [],
  tempToken: '',
  auth_token: '',
  packageId: '',
  businessCategory: '',
  businessType: undefined,
  businessKycUrl: '',
  beneficiaryDetails: {
    accountNumber: '',
    iban: '',
    currency: '',
    Amount: '',
    creditorName: '',
    reference: '',
    accountNo: '',
    sortCode: '',
    name: '',
    payeeName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postCode: '',
    country: '',
    agentCountry: '',
    bic: '',
    agentName: '',
    _id: '',
  },
  data: {
    isPinSet: false,
    // accountsFee: {
    //   accountFee: [],
    //   otherFee: [],
    //   corporateAccounts: [],
    //   payments: {
    //     otherCurrencies: [],
    //   },
    //   accountName: '',
    // },
    mainApplicantAddress: false,
    accountsFee: [],
    IBAN: '',
    accountNumber: '',
    SortCode: '',
    checkBusinessInfo: false,
    allDirectors: [],
    alerts: false,
    cardStatus: '',
    devices: [],
    feePlan: [],
    createdAt: '',
    activeCurrencyAccount: [
      {
        accountId: '',
        accountNumber: '',
        active: false,
        currencyCode: '',
        iban: '',
        sortCode: '',
        approved: false,
      },
    ],
    activeCurrency: 0,
    accountBalance: 0,
    signupFlowCompleted: false,
    _id: '',
    businessType: undefined,
    businessCategory: '',
    businessnName: '',
    email: '',
    regNo: '',
    phoneNumber: '',
    averageSinglePayment: '',
    averagePerWeekPayment: '',
    annualTurnover: '',
    typicallyLargerPayment: '',
    emailVerfied: false,
    phoneVerfied: false,
    isVerified: false,
    isVerifiedAt: '',
    directorVerified: false,
    numberOfDirectors: 0,
    incorporationNumber: '',
    registrationDate: '',
    startedTradingDate: '',
    kyc: {
      isFinished: false,
      failedReason: '',
      kycStatus: '',
    },
    address: {
      line1: '',
      line2: '',
      line3: '',
    },
    city: '',
    country: '',
    businessWebsite: '',
    businessEmail: '',
    place: '',
    passCode: '',
    transactionLimit: 0,
    registredAt: null,
    shareHolder: false,
    checkApplicant: false,
    checkDirector: false,
    onBoardingFee: false,
    monthlyFee: false,
    accountBlock: false,
    notAllowed: {
      transactions: false,
      getTransactions: false,
      checkBalance: false,
      signIn: false,
    },
    steps: 0,
    businessinfo: [],
    docsUpload1: false,
    docsUpload2: false,
    businessDocs: [],
    checkImportantInfo: false,
    gbg: {
      steps: {
        idfront: {
          uploaded: false,
          isFailed: false,
          failedMessage: '',
          retriesScan: '',
          images: [],
        },
        idback: {
          uploaded: false,
          isFailed: false,
          notRequired: false,
          failedMessage: '',
          retriesScan: '',
          images: [],
        },
        poa: {
          uploaded: false,
          isFailed: false,
          failedMessage: '',
          retriesScan: '',
          images: [],
        },
        selfie: {
          uploaded: false,
          isFailed: false,
          failedMessage: '',
          retriesScan: '',
          images: [],
        },
      },
      isFinished: false,
      scanToken: null,
      kycStatus: '',
      idScanCompleted: false,
    },
    multiCurrencyAccounts: [],
    companyDetails: [],
    mainApplicant: {
      directors: [{ peopleId: '' }],
      place: '',
      id: '',
      peopleId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      country: '',
      email: '',
      phoneNumber: '',
      city: '',
      fAddress: '',
      sAddress: '',
      tAddress: '',
      postalCode: '',
      address: {
        city: '',
        fAddress: '',
        sAddress: '',
        tAddress: '',
        postalCode: '',
      },
      status: '',
      dateOfLatestChange: '',
      dateOfBirth: '',
      score: 0,
      numEmployeesfrom: 0,
      numEmployeesTo: 0,
      preTaxProfit: 0,
      taxCode: '',
      createdAt: '',
      updatedAt: '',
      __v: 0,
    },
    jwttoken: '',
  },
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setPackageId(state, action) {
      state.packageId = action.payload;
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
      state.auth_token = action.payload;
    },
    setBusinessKycUrl(state, action) {
      state.businessKycUrl = action.payload.Url;
    },
    resetPackageId(state) {
      state.packageId = '';
    },
    resetBusinessTempToken(state) {
      state.tempToken = '';
      state.auth_token = '';
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
    resetBeneficiaryDetails(state) {
      state.beneficiaryDetails = initialState.beneficiaryDetails;
    },
    businessLogout(state: IBusinessState) {
      console.log('Business Logout');
      state.auth_token = '';
      state.tempToken = '';
      state.signInBusinessEmail = '';
      state.data = initialState.data;
      state.packageId = '';
      state.businessType = undefined;
      state.businessKycUrl = initialState.businessKycUrl;

      // console.log('businessLogout', state);
    },
    resetBusinessCategory(state) {
      state.businessCategory = '';
    },
    setBusinessPassCode(state, action) {
      state.businessReduxPassCode = action.payload;
    },
    resetBusinessType(state) {
      state.businessType = 1;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      businessAuthApi.endpoints.businessAutoSignup.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.data?.jwttoken;
        state.data = payload.data;
        state.businessKycUrl = initialState.businessKycUrl;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.businessManualSignup.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.data?.jwttoken;
        console.log('Manual Signup', payload?.data);
        state.data = payload.data;
        state.businessEmail = payload.data?.email;
        state.businessPhone = payload.data?.phoneNumber;
        state.businessKycUrl = initialState.businessKycUrl;
      },
    );
    // builder.addMatcher(
    //   businessAuthApi.endpoints.businessSignin.matchFulfilled,
    //   (state, { payload }) => {
    // state.tempToken = payload.data?.jwttoken;
    //   },
    // );
    builder.addMatcher(
      businessAuthApi.endpoints.businessVerifySignIn.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.data?.jwttoken;
        state.tempToken = '';
        state.data = payload.data;
        state.packageId = '';
        state.businessType = initialState.businessType;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.buisnessSignout.matchFulfilled,
      state => {
        console.log('Business Signout');
        state.auth_token = '';
        state.tempToken = '';
        state.signInBusinessEmail = '';
        state.data = initialState.data;
        state.packageId = '';
        state.businessCategory = '';
        state.businessType = 1;
        state.businessKycUrl = '';
        state.beneficiaryDetails = initialState.beneficiaryDetails;
        state.selectedBenefBankDetails = initialState.selectedBenefBankDetails;
        state.getBusinessBeneficiary = initialState.getBusinessBeneficiary;
        state.lastSelectedBusinessBenefDetails =
          initialState.lastSelectedBusinessBenefDetails;
        state.quoteDetails = initialState.quoteDetails;
        state.outgoingBusReduxData = initialState.outgoingBusReduxData;
        state.showIbanAccountToggle = initialState.showIbanAccountToggle;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.businessVerifyEmailSignUp.matchFulfilled,
      (state, { payload }) => {
        state.data.emailVerfied = payload.results?.emailVerified;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.businessVerifyPhoneSignUp.matchFulfilled,
      (state, { payload }) => {
        state.data.phoneVerfied = payload.results?.phoneVerified;
      },
    );
    // builder.addMatcher(
    //   businessAuthApi.endpoints.businessCurrent.matchFulfilled,
    //   (state, { payload }) => {
    //     state.data = payload.results;
    //   },
    // );
    builder.addMatcher(
      businessAuthApi.endpoints.forgotBusinessPasswordEmail.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.results?.auth_token;
      },
    );
    builder.addMatcher(
      businessKycApi.endpoints.businessKyc.matchFulfilled,
      (state, { payload }) => {
        state.businessKycUrl = payload.data?.data?.URL;
        // console.log('redux Kyc ', payload.data?.data?.URL);
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.forgotBusinessPasswordPhone.matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.results?.auth_token;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.verifyForgotBusinessPasswordEmail
        .matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.results?.auth_token;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.verifyForgotBusinessPasswordPhone
        .matchFulfilled,
      (state, { payload }) => {
        state.auth_token = payload.results?.auth_token;
      },
    );
    builder.addMatcher(
      businessAuthApi.endpoints.resetBusinessPassword.matchFulfilled,
      state => {
        state.auth_token = '';
      },
    );
    builder.addMatcher(
      businessMainApi.endpoints.getPayee.matchFulfilled,
      (state, { payload }) => {
        state.getBusinessBeneficiary = payload.data?.contacts;
      },
    );
    builder.addMatcher(
      businessMainApi.endpoints.getMultiPayee.matchFulfilled,
      (state, { payload }) => {
        state.getBusinessBeneficiary = payload.data?.contacts;
      },
    );

    builder.addMatcher(
      businessMainApi.endpoints.exchangeQuoteBusiness.matchFulfilled,
      (state, { payload }) => {
        state.quoteDetails = payload?.data;
      },
    );
    builder.addMatcher(
      businessCurrentApi.endpoints.getCurrentBusiness.matchFulfilled,
      (state, { payload }) => {
        state.data = payload.data;
      },
    );
  },
});

export const {
  setPackageId,
  resetPackageId,
  setBusinessCategory,
  setBusinessType,
  businessLogout,
  setIsInternal,
  resetBusinessCategory,
  setBusinessKycUrl,
  resetBusinessType,
  resetBusinessTempToken,
  setBusinessPassCode,
  setBeneficiaryDetails,
  lastSelectedBeneficiaryDetails,
  resetBeneficiaryBankDetails,
  setBeneficiaryId,
  businessQrSignin,
  setSigninBusinessEmail,
  resetBeneficiaryDetails,
  setShowToogle,
} = businessSlice.actions;
export default businessSlice.reducer;
