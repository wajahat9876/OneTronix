/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBusinessState } from "@/store/slices/business/businessSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import Config from "@src/constants/Config";

export const businessKycApi = createApi({
  reducerPath: "businessKycApi",
  refetchOnFocus: false,
  baseQuery: fetchBaseQuery({
    baseUrl: Config.baseURL,
    prepareHeaders: (headers, { getState }) => {
      const { auth_token } = (getState() as { business: IBusinessState })
        .business;

      if (auth_token) {
        headers.set("Authorization", `Bearer ${auth_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["businessCurrent"],
  endpoints: (builder) => ({}),
});

export const {} = businessKycApi;
