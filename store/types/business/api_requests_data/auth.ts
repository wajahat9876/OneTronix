export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  packageId: string;
  businessType: string;
  businessName: string;
  regNo: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  typicallyLagerPayment: number;
  annualTurnover: number;
  averagePerWeekPayment: number;
  averageSinglePayment: number;
  businessCategory: string;
  address?: {
    line1: string;
    line2: string;
    line3: string;
  };
  city?: string;
  country?: string;
  passCode?: string;
  place?: string;
  businessEmail?: string;
  businessWebsite?: string;
  numberOfDirectors?: number;
  incorporationNumber?: string;
  registrationDate?: string;
  startedTradingDate?: string;
  notificationToken?: string;
  deviceOS?: any;
  deviceModal?: any;
  deviceId?: any;
  deviceType?: any;
}

export interface VerifyOtpPayload {
  otp: string;
  notificationToken?: string;
  deviceOS?: any;
  deviceModal?: any;
  deviceId?: any;
  deviceType?: any;
  otpTypes?: string;
}

export interface MainApplicantPayload {
  peopleId: string;
}

export interface AddDirectorPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  // company: string;
  dateOfBirth: string;
  // street: string;
  city: string;
  pCode: string;
  email: string;
  phoneNumber: string;
  // gender: string;
  fAddress: string;
  sAddress: string;
  tAddress: string;
  place: string;
  nationality: string;
}

export interface AddManualApplicantPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  company: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  gender: string;
  email: string;
  phoneNumber: string;
}
export interface UpdateMainApplicantPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  peopleId: string;
}
export interface AddShareholderPayload {
  DirectorAndShares: boolean;
  city: string;
  country: string;
  dateOfBirth: string;
  email: string;
  fAddress: string;
  firstName: string;
  lastName: string;
  nationality: string;
  phoneNumber: string;
  place: string;
  postalCode: string;
  sAddress: string;
  shareHolders: string;
  surName: string;
  tAddress: string;
  // shareHolders: [
  //   {
  //     name: string;
  //     email: string;
  //     percentSharesHeld: string;
  //     dateOfBirth: string;
  //     phoneNumber: string;
  //     address: {
  //       street: string;
  //       city: string;
  //       postalCode: string;
  //       country: string;
  //     };
  //   },
  // ];
}

export interface UploadDocumentsPayload {
  docType: number;
  base64Strings: {
    base64String: string;
    fileType: string | number;
    fileName: string;
    type: string;
  }[];
  businessOverview?: string;
  pepDeclaration?: boolean;
}

export interface AllDirectorsAdded {
  allDirectorsAdded: boolean;
}

export interface AllShareholdersAdded {
  allShareholdersAdded: boolean;
}
