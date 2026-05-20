import { IBusinessState } from '@/store/slices/business/businessSlice';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import Config from '@src/constants/Config';
import { getDemoResponse, isDemoMode } from '@utils/demo';

type PrepareHeaders = (
  headers: Headers,
  api: { getState: () => unknown },
) => Headers;

export const createBaseQueryWithDemo = (
  prepareHeaders: PrepareHeaders,
): BaseQueryFn => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: Config.baseURL,
    prepareHeaders,
  });

  return async (args, api, extraOptions) => {
    const { auth_token } = (api.getState() as { business: IBusinessState })
      .business;

    if (isDemoMode(auth_token)) {
      const url = typeof args === 'string' ? args : args.url;
      const method =
        typeof args === 'string' ? 'GET' : (args as FetchArgs).method || 'GET';
      return { data: getDemoResponse(url, method) };
    }

    return rawBaseQuery(args, api, extraOptions);
  };
};
