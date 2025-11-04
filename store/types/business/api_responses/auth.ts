/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAPIRespone, IAPIResponeData } from "store/types";

export interface SignIn {
  auth_token: string;
  token: string;
}
export interface inverterData {
  inverterData: {
    data: {
      ac: any;
      battery: any;
      hvdc: any;
      output: any;
      solar: any;
      temperature: any;
    };
  };
}
export interface LastSelectBenefDetails {
  isFirstTransfer?: boolean;
  accountNumber?: string;
  beneficiaryId?: string;
  country?: string;
  currency?: string;
  iban?: string;
  id?: string;
  _id?: string;
  bankName?: string;
  routingCodes: {
    bic?: string;
    "sort-code"?: string;
    aba?: string;
  };
}
export interface businessPayee {
  sortCode?: string;
  accountNo?: string;
  accountNumber?: string;
  creditorName: string;
  Amount: string;
  reference: string;
  name?: string;
  creditAccountIban?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  postCode?: string;
  country?: string;
  iban?: string;
  payeeName?: string;
  agentName?: string;
  bic?: string;
  agentCountry?: string;
  currency?: string;
  _id?: string;
}

export interface OutgoingTransfer {
  amount: string;
  transferReasonId: string;
  description: string;
  currency?: string;
  country?: string;
}
export interface VerifySignIn {
  auth_token: string;
  email: string;
  firstName: string;
  isVerified: boolean;
  isBlocked: boolean;
  lastName: string;
  devices: any[];
  _id: string;
  notificationCount: number;
}
interface BusinessAutoSignUp {
  businessType: boolean;
  businessCategory: string;
  businessnName: string;
  email: string;
  checkBusinessInfo: boolean;
  regNo: string;
  directorVerified: boolean;
  phoneNumber: string;
  packageId: string;
  emailVerfied: boolean;
  phoneVerfied: boolean;
  isVerified: boolean;
  transactionLimit: number;
  registredAt: null;
  shareHolder: boolean;
  checkApplicant: boolean;
  checkDirector: boolean;
  onBoardingFee: boolean;
  monthlyFee: boolean;
  accountBlock: boolean;
  notAllowed: {
    transactions: boolean;
    getTransactions: boolean;
    checkBalance: boolean;
    signIn: boolean;
  };
  tokenVersion: number;
  steps: number;
  docsUpload1: boolean;
  docsUpload2: boolean;
  businessDocs: any[];
  accountDetails: any[];
  jwttoken: string;
}

interface BusinessManualSignUp {
  token: string;
  businessType: boolean;
  businessCategory: string;
  businessnName: string;
  email: string;
  regNo: string;
  linkedDeviceId: string;
  averageSinglePayment: string;
  averagePerWeekPayment: string;
  annualTurnover: string;
  typicallyLargerPayment: string;
  phoneNumber: string;
  checkBusinessInfo: boolean;
  packageId: string;
  emailVerfied: boolean;
  directorVerified: boolean;
  phoneVerfied: boolean;
  isVerified: boolean;
  numberOfDirectors: number;
  incorporationNumber: string;
  registrationDate: string;
  startedTradingDate: string;
  address: {
    line1: string;
    line2: string;
    line3: string;
  };
  city: string;
  country: string;
  businessWebsite: string;
  businessEmail: string;
  place: string;
  passCode: string;
  transactionLimit: number;
  registredAt: null;
  shareHolder: boolean;
  checkApplicant: boolean;
  checkDirector: boolean;
  onBoardingFee: boolean;
  monthlyFee: boolean;
  accountBlock: boolean;
  notAllowed: {
    transactions: boolean;
    getTransactions: boolean;
    checkBalance: boolean;
    signIn: boolean;
  };
  tokenVersion: number;
  steps: number;
  docsUpload1: boolean;
  docsUpload2: boolean;
  businessDocs: any[];
  jwttoken: string;
}

interface VerifySignupEmail {
  email: string;
  emailVerified: boolean;
}

interface VerifySignupPhone {
  phoneNumber: string;
  phoneVerified: boolean;
}

// interface Current {
//   _id: string;
//   businessType: string;
//   businessCategory: string;
//   businessName: string;
//   email: string;
//   regNo: string;
//   phoneNumber: string;
//   averageSinglePayment: string;
//   averagePerWeekPayment: string;
//   annualTurnover: string;
//   typicallyLargerPayment: string;
//   emailVerified: boolean;
//   phoneVerified: boolean;
//   isVerified: boolean;
//   numberOfDirectors: number;
//   incorporationNumber: string;
//   registrationDate: string;
//   startedTradingDate: string;
//   address: {
//     line1: string;
//     line2: string;
//     line3: string;
//   };
//   city: string;
//   country: string;
//   businessWebsite: string;
//   businessEmail: string;
//   place: string;
//   passCode: string;
//   transactionLimit: number;
//   registredAt: null;
//   shareHolder: boolean;
//   checkApplicant: boolean;
//   checkDirector: boolean;
//   allDirectorsAdded: boolean;
//   allShareholdersAdded: boolean;
//   onBoardingFee: boolean;
//   monthlyFee: boolean;
//   accountBlock: boolean;
//   notAllowed: {
//     transactions: boolean;
//     getTransactions: boolean;
//     checkBalance: boolean;
//     signIn: boolean;
//   };
//   steps: number;
//   businessinfo: any[];
//   docsUpload1: boolean;
//   docsUpload2: boolean;
//   businessDocs: any[];
//   checkImportantInfo: boolean;
//   gbg: Gbg;
//   accountDetails: any[];
//   companyDetails: CompanyDetails[];
//   mainApplicant: MainApplicant[];
// }

interface Gbg {
  steps: {
    idfront: Idfront;
    idback: IdBack;
    poa: Idfront;
    selfie: Idfront;
  };
  kycStatus: string;
  isFinished: boolean;
  scanToken: null;
  idScanCompleted: boolean;
}

interface IdBack {
  uploaded: boolean;
  isFailed: boolean;
  notRequired: boolean;
  failedMessage: string;
  retriesScan: string;
  images: any[];
}

interface Idfront {
  uploaded: boolean;
  isFailed: boolean;
  failedMessage: string;
  retriesScan: string;
  images: any[];
}
interface Director {
  peopleId: string;
}
interface MainApplicant {
  directors?: Director[];
  id: string;
  peopleId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  email?: string;
  phoneNumber?: string;
  place: string;
  city: string;
  fAddress: string;
  postalCode: string;
  sAddress: string;
  tAddress: string;
  address: {
    city: string;
    fAddress: string;
    postalCode: string;
    sAddress: string;
    tAddress: string;
  };
  status: string;
  dateOfLatestChange: string;
  dateOfBirth: string;
  score: number;
  numEmployeesfrom: number;
  numEmployeesTo: number;
  preTaxProfit: number;
  taxCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CompanyDetail {
  _id: string;
  correlationId: string;
  companyId: string;
  businessName: string;
  registeredCompanyName: string;
  country: string;
  companyNumber: string;
  companyRegistrationNumber: string;
  ggsId: string;
  companyRegistrationDate: string;
  description: string;
  companyStatus: string;
  latestTurnoverFigure: LatestTurnoverFigure;
  latestShareholdersEquityFigure: LatestTurnoverFigure;
  contactAddress: {
    type: string;
    simpleValue: string;
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
    province: string;
    directMarketingOptOut: boolean;
  };
  currentCreditRating: {
    commonValue: string;
    commonDescription: string;
    creditLimit: LatestTurnoverFigure;
    providerValue: {
      maxValue: string;
      minValue: string;
      value: string;
    };
    providerDescription: string;
    pod: number;
  };
  currentContractLimit: LatestTurnoverFigure;
  latestRatingChangeDate: string;
  shareCapitalStructure: {
    issuedShareCapital: LatestTurnoverFigure;
    numberOfSharesIssued: number;
    shareHolders: ShareHolder[];
  };
  currentDirectors: CurrentDirector[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CurrentDirector {
  id: string;
  idType: string;
  name: string;
  title: string;
  firstName: string;
  middleName: string;
  surname?: string;
  lastName?: string;
  address: {
    type: string;
    simpleValue: string;
    street: string;
    city: string;
    postalCode: string;
  };
  gender: string;
  dateOfBirth: string;
  nationality: string;
  directorType: string;
  phoneNumber: string;
  email: string;
  positions: {
    dateAppointed: string;
    positionName: string;
    _id: string;
  }[];
  additionalData: {
    presentAppointments: number;
    disqualified: boolean;
    disqualifiedException: boolean;
  };
  _id: string;
}

interface ShareHolder {
  name: string;
  shareholderType: string;
  shareType: string;
  currency: string;
  totalValueOfSharesOwned: number;
  totalNumberOfSharesOwned: number;
  percentSharesHeld: number;
  shareClasses: {
    shareType: string;
    currency: string;
    valuePerShare: string;
    numberOfSharesOwned: number;
    valueOfSharesOwned: number;
    additionalData: {
      percentSharesHeld: number;
    };
    _id: string;
  }[];
  _id: string;
}

interface LatestTurnoverFigure {
  currency: string;
  value: string;
}

type DocumentResults = string[];

interface ActiveCompanies {
  correlationId: string;
  totalSize: number;
  companies: {
    id: string;
    country: string;
    regNo: string;
    vatNo: string[];
    safeNo: string;
    name: string;
    address: {
      simpleValue: string;
      street: string;
      city?: string;
      postCode?: string;
    };
    status: string;
    type: string;
    dateOfLatestAccounts: string;
    dateOfLatestChange: string;
    phoneNumbers?: string[];
    statusDescription: string;
    previousNames: string[];
    activityCode?: string;
  }[];
}

export type ISignInResponse = IAPIRespone<SignIn>;
export type IVerifySignInResponse = IAPIResponeData<VerifySignIn>;
export type IBusinessAutoSignUpResponse = IAPIResponeData<BusinessAutoSignUp>;
export type IBusinessManualSignUpResponse = IAPIRespone<BusinessManualSignUp>;
export type IVerifySignupEmailResponse = IAPIRespone<VerifySignupEmail>;
export type IVerifySignupPhoneResponse = IAPIRespone<VerifySignupPhone>;
export type IUploadDocumentResponse = IAPIRespone<DocumentResults>;
export type ICurrentResponse = IAPIRespone<VerifySignIn>;
export type IActiveCompaniesResponse = IAPIResponeData<ActiveCompanies>;
export type IDirectorResponse = IAPIResponeData<CurrentDirector[]>;
export type IShareholderResponse = IAPIRespone<ShareHolder[]>;
