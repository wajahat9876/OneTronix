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
    changeActiveInverter: builder.mutation<any, any>({
      query: (body) => ({
        url: "user/devices/change-device",
        method: "PATCH",
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
    changeInverterSetting: builder.mutation<any, any>({
      query: (body) => ({
        url: "user/devices/",
        method: "PATCH",
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
    getNotifications: builder.query<any, any>({
      query: ({ deviceId }) => ({
        url: `user/alerts?deviceId=${deviceId}`,
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
    readNotifications: builder.mutation<any, any>({
      query: ({ deviceId }) => ({
        url: `user/alerts?deviceId=${deviceId}`,
        method: "PUT",
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
    addNewDevice: builder.mutation<any, any>({
      query: (body) => ({
        url: "user/devices/",
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

    verifyCurrentPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "user/auth/password/verify",
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
    verifyNewPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "user/auth/password",
        method: "PUT",
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
  }),
});

export const {
  useVerifyNewPasswordMutation,
  useVerifyCurrentPasswordMutation,
  useAddNewDeviceMutation,
  useReadNotificationsMutation,
  useGetNotificationsQuery,
  useChangeActiveInverterMutation,
  useChangeInverterSettingMutation,
  useLazyGetInverterDataQuery,
  useGetGraphDataQuery,
  useGetAnalyticsDataQuery,
} = businessMainApi;
