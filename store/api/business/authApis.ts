/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prepareHeaderBusiness from '@/store/slices/business/baseQueryWithHash';
import { IAPIError, IAPISuccess } from '@/store/types';
import {
  AddDirectorPayload,
  AddShareholderPayload,
  MainApplicantPayload,
  SignInPayload,
  SignUpPayload,
  UpdateMainApplicantPayload,
  UploadDocumentsPayload,
  VerifyOtpPayload,
} from '@/store/types/business/api_requests_data/auth';
import {
  IActiveCompaniesResponse,
  IBusinessAutoSignUpResponse,
  IBusinessManualSignUpResponse,
  ICurrentResponse,
  IDirectorResponse,
  IShareholderResponse,
  ISignInResponse,
  IUploadDocumentResponse,
  IVerifySignInResponse,
  IVerifySignupEmailResponse,
  IVerifySignupPhoneResponse,
} from '@/store/types/business/api_responses/auth';
import { handleLogout } from '@/store/utils/errorHandler';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { businessCurrentApi } from './businessCurrent';

export const businessAuthApi = createApi({
  reducerPath: 'businessAuthApi',
  refetchOnFocus: false,
  baseQuery: prepareHeaderBusiness,
  //  fetchBaseQuery({
  //   baseUrl: Config.baseURL,
  //   prepareHeaders: (headers, { getState }) => {
  //     const { tempToken, auth_token } = (
  //       getState() as { business: IBusinessState }
  //     ).business;
  //     if (tempToken) {
  //       headers.set('Authorization', `Bearer ${tempToken}`);
  //     } else if (auth_token) {
  //       headers.set('Authorization', `Bearer ${auth_token}`);
  //     }
  //     return headers;
  //   },
  // }),
  tagTypes: ['Directors'],
  endpoints: builder => ({
    businessSignin: builder.mutation<ISignInResponse, SignInPayload>({
      query: body => ({
        url: 'auth/signin',
        method: 'POST',
        body,
      }),

      // extraOptions: { endPoint: '/signin' }, // for hashMac
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessVerifySignIn: builder.mutation<
      IVerifySignInResponse,
      VerifyOtpPayload
    >({
      query: body => ({
        url: 'auth/verifySigninOtp',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessAutoSignup: builder.mutation<
      IBusinessAutoSignUpResponse,
      SignUpPayload
    >({
      query: body => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessManualSignup: builder.mutation<
      IBusinessManualSignUpResponse,
      SignUpPayload
    >({
      query: body => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessVerifyEmailSignUp: builder.mutation<
      IVerifySignupEmailResponse,
      VerifyOtpPayload
    >({
      query: body => ({
        url: 'auth/verifyEmailOtp',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessVerifyPhoneSignUp: builder.mutation<
      IVerifySignupPhoneResponse,
      VerifyOtpPayload
    >({
      query: body => ({
        url: 'auth/verifyPhoneOtp',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    updateAddress: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/updateMainApplicantAddress',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    setBusinessPin: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/setPin',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    verifyBusinessPin: builder.mutation({
      query: body => ({
        url: 'auth/verifyPin',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    businessVerifyTermAndConditions: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/termAndConditions',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    updateBusinessPhoneNumber: builder.mutation<any, any>({
      query: body => ({
        url: 'business/auth/updatebusinessdetails',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    forgotBusinessPasswordEmail: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/forgetPasswordEmail',
        method: 'POST',
        body,
      }),
    }),
    forgotBusinessPasswordPhone: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/forgetPasswordNumber',
        method: 'POST',
        body,
      }),
    }),
    verifyForgotBusinessPasswordEmail: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/Verify-Otp',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    verifyForgotBusinessPasswordPhone: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/Verify-Otp',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    resetBusinessPassword: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    // businessCurrent: builder.query<ICurrentResponse, void>({
    //   query: () => ({
    //     url: 'business/auth/current',
    //     method: 'GET',
    //   }),
    //   providesTags: ['GetBusinessData'],
    // }),

    businessFeePlans: builder.query<any, void>({
      query: () => ({
        url: 'clearBank/getFeeDetails',
        method: 'GET',
      }),
    }),

    businessAddDirector: builder.mutation<
      IAPISuccess | IAPIError,
      AddDirectorPayload
    >({
      query: body => ({
        url: 'auth/directors',
        method: 'POST',
        body,
      }),

      invalidatesTags: ['Directors'],
      // async onQueryStarted(_, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //     dispatch(businessAuthApi.util.invalidateTags(['Directors']));
      //   } catch (e) {
      //     console.error('getting directors after insertion error: ', e);
      //   }
      // },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessAddShareholder: builder.mutation<
      IAPISuccess | IAPIError,
      AddShareholderPayload
    >({
      query: body => ({
        url: 'auth/shareHolder',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessSelectMainApplicant: builder.mutation<
      IAPISuccess | IAPIError,
      MainApplicantPayload
    >({
      query: ({ peopleId }) => ({
        url: `auth/creditSafeDirectorCheck?peopleId=${peopleId}`,
        method: 'GET',
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    businessUpdateMainApplicant: builder.mutation<
      IAPISuccess | IAPIError,
      UpdateMainApplicantPayload
    >({
      query: body => ({
        url: 'auth/updateMainApplicant',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    getActiveCompanies: builder.query<
      IActiveCompaniesResponse,
      { nameSearch: string }
    >({
      query: ({ nameSearch }) => ({
        url: `/auth/creditSafeNameSearch?nameSearch=${encodeURIComponent(
          nameSearch,
        )}`,
        method: 'GET',
      }),
    }),

    getAllDirector: builder.query<IDirectorResponse, any>({
      query: ({ type }) => ({
        url: `auth/getDirectorShareholder?&type=${type}`,
        method: 'GET',
      }),
      providesTags: ['Directors'],
    }),

    getAllShareholder: builder.query<IShareholderResponse, void>({
      query: () => ({
        url: 'business/auth/shareHolder',
        method: 'POST',
      }),
    }),

    businessUploadDocuments: builder.mutation<
      IUploadDocumentResponse,
      UploadDocumentsPayload
    >({
      query: body => ({
        url: 'auth/uploadImagedocs',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    businessInfo: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/businessInfo',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    importantInfo: builder.mutation({
      query: body => ({
        url: 'auth/checkImportantInfo',
        method: 'POST',
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    signupFlowCompleted: builder.mutation<any, void>({
      query: () => ({
        url: 'business/auth/signupFlowCompleted',
        method: 'POST',
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    transactionAlert: builder.mutation<any, any>({
      query: ({ type }) => ({
        url: `business/auth/alerts?type=${type}`,
        method: 'POST',
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    resendBusinessSigninOtp: builder.mutation({
      query: ({ email }) => ({
        url: 'business/auth/resend-signin-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    resendBusinessEmailOtp: builder.mutation({
      query: ({ email }) => ({
        url: 'auth/resendEmailOtp',
        method: 'POST',
        body: { email },
      }),
    }),
    resendBusinessPhoneOtp: builder.mutation({
      query: ({ phoneNumber }) => ({
        url: 'auth/resendPhoneOtp',
        method: 'POST',
        body: { phoneNumber },
      }),
    }),
    buisnessSignout: builder.mutation<any, any>({
      query: body => ({
        url: 'auth/signOut',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // dispatch(
          //   businessCurrentApi.util.invalidateTags(['getBusinessCurrent']),
          // );
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useBusinessSigninMutation,
  useBusinessVerifySignInMutation,
  useBusinessAutoSignupMutation,
  useBusinessManualSignupMutation,
  useBusinessVerifyEmailSignUpMutation,
  useBusinessVerifyPhoneSignUpMutation,
  useBusinessInfoMutation,
  useSetBusinessPinMutation,
  useVerifyBusinessPinMutation,
  useForgotBusinessPasswordEmailMutation,
  useForgotBusinessPasswordPhoneMutation,
  useVerifyForgotBusinessPasswordEmailMutation,
  useVerifyForgotBusinessPasswordPhoneMutation,
  useResetBusinessPasswordMutation,
  useBusinessUpdateMainApplicantMutation,
  useBusinessVerifyTermAndConditionsMutation,
  useBusinessFeePlansQuery,
  useBusinessAddDirectorMutation,
  useBusinessAddShareholderMutation,
  useBusinessSelectMainApplicantMutation,
  useGetActiveCompaniesQuery,
  useGetAllDirectorQuery,
  useGetAllShareholderQuery,
  useBusinessUploadDocumentsMutation,
  useImportantInfoMutation,
  useResendBusinessEmailOtpMutation,
  useResendBusinessPhoneOtpMutation,
  useResendBusinessSigninOtpMutation,
  useBuisnessSignoutMutation,
  useUpdateAddressMutation,
  // Unused Api
  useTransactionAlertMutation,
  useUpdateBusinessPhoneNumberMutation,
  useSignupFlowCompletedMutation,
} = businessAuthApi;
