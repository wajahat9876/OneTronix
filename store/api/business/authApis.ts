/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBusinessState } from "@/store/slices/business/businessSlice";
import {
  SignInPayload,
  SignUpPayload,
  VerifyOtpPayload,
} from "@/store/types/business/api_requests_data/auth";
import {
  IBusinessAutoSignUpResponse,
  IBusinessManualSignUpResponse,
  ICurrentResponse,
  ISignInResponse,
  IVerifySignupEmailResponse,
} from "@/store/types/business/api_responses/auth";
import { handleLogout } from "@/store/utils/errorHandler";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import Config from "@src/constants/Config";
import { businessCurrentApi } from "./businessCurrent";

export const businessAuthApi = createApi({
  reducerPath: "businessAuthApi",
  refetchOnFocus: false,
  baseQuery: fetchBaseQuery({
    baseUrl: Config.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const { tempToken, auth_token } = (
        getState() as { business: IBusinessState }
      ).business;
      // if (tempToken) {
      //   headers.set("Authorization", `Bearer ${tempToken}`);
      // } else
      if (auth_token) {
        headers.set("Authorization", `Bearer ${auth_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Directors"],
  endpoints: (builder) => ({
    businessSignin: builder.mutation<ISignInResponse, SignInPayload>({
      query: (body) => ({
        url: "user/auth/signin",
        method: "POST",
        body,
      }),

      // extraOptions: { endPoint: '/signin' }, // for hashMac
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    verifyOtp: builder.mutation<any, VerifyOtpPayload>({
      query: (body) => ({
        url: "user/auth/verifyOtp",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
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
      query: (body) => ({
        url: "user/auth/createCustomer",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    businessManualSignup: builder.mutation<IBusinessManualSignUpResponse, any>({
      query: (body) => ({
        url: "user/auth/createCustomer",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // dispatch(
          //   businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
          // );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    businessSignupInstaller: builder.mutation<
      IBusinessManualSignUpResponse,
      any
    >({
      query: (body) => ({
        url: "installer/auth/signup",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
    verifyOtpInstaller: builder.mutation<any, any>({
      query: (body) => ({
        url: "installer/auth/verifyOTP",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
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
      query: (body) => ({
        url: "auth/verifyEmailOtp",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
          );
        } catch (data: ICurrentResponse | any) {
          // handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),

    forgotBusinessPasswordEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: "auth/forgetPasswordEmail",
        method: "POST",
        body,
      }),
    }),

    verifyForgotBusinessPasswordEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: "auth/Verify-Otp",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            businessCurrentApi.util.invalidateTags(["getBusinessCurrent"])
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

    buisnessSignout: builder.mutation<any, any>({
      query: (body) => ({
        url: "auth/signOut",
        method: "POST",
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
  useVerifyOtpMutation,
  useBusinessAutoSignupMutation,
  useBusinessManualSignupMutation,
  useBusinessVerifyEmailSignUpMutation,
  useForgotBusinessPasswordEmailMutation,
  useVerifyForgotBusinessPasswordEmailMutation,
  useBuisnessSignoutMutation,
  useBusinessSignupInstallerMutation,
  useVerifyOtpInstallerMutation,
  // Unused Api
} = businessAuthApi;
