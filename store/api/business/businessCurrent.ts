/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable import/prefer-default-export */
import { IBusinessState } from "@/store/slices/business/businessSlice";
import { ICurrentResponse } from "@/store/types/business/api_responses/auth";
import { handleLogout } from "@/store/utils/errorHandler";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { createBaseQueryWithDemo } from "@utils/demo/baseQueryWithDemo";

export const businessCurrentApi = createApi({
  reducerPath: "businessCurrentApi",
  refetchOnFocus: false,
  baseQuery: createBaseQueryWithDemo((headers, { getState }) => {
    const { auth_token } = (getState() as { business: IBusinessState }).business;
    if (auth_token) {
      headers.set('Authorization', `Bearer ${auth_token}`);
    }
    return headers;
  }),
  tagTypes: ["getBusinessCurrent"],
  endpoints: (builder) => ({
    getCurrentBusiness: builder.query<ICurrentResponse, void>({
      query: () => ({
        url: "user/auth/current",
        method: "GET",
      }),
      providesTags: ["getBusinessCurrent"],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (data: ICurrentResponse | any) {
          handleLogout(data, { dispatch });
        } finally {
          // do nothing
        }
      },
    }),
  }),
});

export const { useGetCurrentBusinessQuery, useLazyGetCurrentBusinessQuery } =
  businessCurrentApi;
