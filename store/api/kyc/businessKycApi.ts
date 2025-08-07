/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prepareHeaderBusiness from '@/store/slices/business/baseQueryWithHash';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ICurrentResponse } from '@/store/types/business/api_responses/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { handleLogout } from '@/store/utils/errorHandler';
import { businessCurrentApi } from '../business/businessCurrent';

export const businessKycApi = createApi({
  reducerPath: 'businessKycApi',
  refetchOnFocus: false,
  baseQuery: prepareHeaderBusiness,
  // fetchBaseQuery({
  //   baseUrl: Config.baseURL,
  //   prepareHeaders: (headers, { getState }) => {
  //     const { auth_token } = (getState() as { business: IBusinessState })
  //       .business;
  //     // if (tempToken) {
  //     //   headers.set('Authorization', `Bearer ${tempToken}`);
  //     // } else
  //     if (auth_token) {
  //       headers.set('Authorization', `Bearer ${auth_token}`);
  //     }
  //     return headers;
  //   },
  // }),
  tagTypes: ['businessCurrent'],
  endpoints: builder => ({
    businessKyc: builder.mutation({
      query: () => ({
        url: 'auth/get-Kyc-Iframe',
        method: 'GET',
      }),
      extraOptions: { endpointName: 'v2' },
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
    resetBusinessKyc: builder.mutation<any, any>({
      query: () => ({
        url: 'auth/reset-Kyc',
        method: 'GET',
      }),
      extraOptions: { endpointName: 'v2' },
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
  }),
});

export const { useBusinessKycMutation, useResetBusinessKycMutation } =
  businessKycApi;
