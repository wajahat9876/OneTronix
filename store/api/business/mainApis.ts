/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBusinessState } from "@/store/slices/business/businessSlice";
import { ICurrentResponse } from "@/store/types/business/api_responses/auth";
import { handleLogout } from "@/store/utils/errorHandler";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "@src/constants/Config";
import { businessCurrentApi } from "./businessCurrent";

export const businessMainApi = createApi({
  reducerPath: "businessMainApi",
  refetchOnFocus: false,
  baseQuery: fetchBaseQuery({
    baseUrl: Config.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const { tempToken, auth_token } = (
        getState() as { business: IBusinessState }
      ).business;
      if (auth_token) {
        headers.set("Authorization", `Bearer ${auth_token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["getPendingExchange"],
  endpoints: (builder) => ({
    getInverterData: builder.query<any, any>({
      query: ({ deviceId }) => ({
        url: `user/devices/inverterData?deviceId=${deviceId}`,
        method: "GET",
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
    getGraphData: builder.query<any, any>({
      query: ({ type, date, deviceId }) => ({
        url: `user/devices/summary?deviceId=${deviceId}&type=${type}&date=${date}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
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
    getAnalyticsData: builder.query<any, any>({
      query: ({ type, date, deviceId }) => ({
        url: `user/devices/analytics?deviceId=${deviceId}&type=${type}&date=${date}`,
        method: "GET",
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
      keepUnusedDataFor: 0,
    }),
    createCurrencyAccount: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-createAccount",
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
    createBusinessBeneficiary: builder.mutation<any, any>({
      query: (body) => ({
        url: "business/integrated-finance/createBeneficiary",
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

    transferAmount: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/transferAmount",
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
    transferInternalPayment: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-internalPayments",
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
    transferOutboundPayment: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-outboundPayment",
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
    exchangeQuoteBusiness: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-requestQuote",
        method: "POST",
        body,
      }),

      invalidatesTags: ["getPendingExchange"],
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
    exchangeTransactionsBusiness: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-executeQuote",
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

    changeActiveBusinessCurrency: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-changeActiveCurrency",
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

    // get Apis

    getTransactionOtp: builder.mutation<any, any>({
      query: () => ({
        url: "clearBank/transcationOtp",
        method: "POST",
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
    getMultiTransactionOtp: builder.mutation<any, any>({
      query: () => ({
        url: "clearBank/multi-transactionOtp",
        method: "POST",
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
    deletePayee: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/deletePayee",
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
    deleteMultiPayee: builder.mutation<any, any>({
      query: (body) => ({
        url: "clearBank/multi-deletePayee",
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

    getTargetedStatement: builder.query<any, any>({
      query: ({ from, to }) => ({
        url: `clearBank/getTargetedTranscation?transcationType=debitCredit&from=${from}&to=${to}`,
        method: "GET",
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
    getMulticurrencyStatement: builder.query<any, any>({
      query: ({ to, from }) => ({
        url: `clearBank/multi-getTargetedTranscation?transcationType=debitCredit&from=${from}&to=${to}`,
        method: "GET",
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
    getTargetedTransaction: builder.query<any, any>({
      query: ({ pageNo, pageSize }) => ({
        url: `clearBank/getTargetedTranscation?transcationType=debitCredit&pageSize=${pageSize}&pageNumber=${pageNo}`,
        method: "GET",
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
    getMulticurrencyTransaction: builder.query<any, any>({
      query: ({ pageNo, pageSize }) => ({
        url: `clearBank/multi-getTargetedTranscation?transcationType=debitCredit&pageSize=${pageSize}&pageNumber=${pageNo}`,
        method: "GET",
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
    getPendingExchangeTransactions: builder.query<any, any>({
      query: ({ pageSize, pageNumber }) => ({
        url: `clearBank/multi-getPendingExchanges?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["getPendingExchange"],
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
    getBusinessFeePlan: builder.query<any, any>({
      query: ({ id }) => ({
        url: `business/auth/feePlan?_id=${id}`,
        method: "GET",
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

    getPayee: builder.query<any, any>({
      query: () => ({
        url: "clearBank/contacts?pageSize=20&pageNumber=1",
        method: "GET",
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

    createBusinessBeneficiaryOtp: builder.mutation<any, any>({
      query: () => ({
        url: "business/integrated-finance/create-benificiary-otp",
        method: "GET",
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
    getAllAccountBalance: builder.query<any, any>({
      query: () => ({
        url: "clearBank/multi-getAllAccountsBalance",
        method: "GET",
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
    getFeeInvoice: builder.query<any, any>({
      query: () => ({
        url: "clearBank/feeInvoces",
        method: "GET",
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
  }),
});

export const {
  useLazyGetInverterDataQuery,
  useGetGraphDataQuery,
  useGetAnalyticsDataQuery,
  useGetAllAccountBalanceQuery,
  useGetMultiTransactionOtpMutation,
  useTransferInternalPaymentMutation,
  useTransferOutboundPaymentMutation,
  useChangeActiveBusinessCurrencyMutation,
  useCreateCurrencyAccountMutation,
  useCreateBusinessBeneficiaryMutation,
  useExchangeQuoteBusinessMutation,
  useExchangeTransactionsBusinessMutation,
  useGetTargetedTransactionQuery,
  useGetMulticurrencyTransactionQuery,
  useGetTransactionOtpMutation,
  useLazyGetPayeeQuery,
  useTransferAmountMutation,
  useGetFeeInvoiceQuery,
  useGetBusinessFeePlanQuery,
  useCreateBusinessBeneficiaryOtpMutation,
  useDeletePayeeMutation,
  useDeleteMultiPayeeMutation,
  useLazyGetTargetedStatementQuery,
  useLazyGetMulticurrencyStatementQuery,
  useGetPendingExchangeTransactionsQuery,
} = businessMainApi;
