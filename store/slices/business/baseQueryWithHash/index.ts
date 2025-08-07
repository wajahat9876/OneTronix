/* eslint-disable default-param-last */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */

import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import Config from '@src/constants/Config';
import HeaderKeys from '@src/constants/HeaderKeys';
import { createHash } from '@store/utils/hashUtils';
import { IBusinessState } from '../businessSlice';

const prepareHeaderBusiness = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  const { endpointName } = extraOptions || {};
  const baseUrl = endpointName === 'v2' ? Config.baseURL2 : Config.baseURL;
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, extra }) => {
      const { hashValues } = extra as {
        hashValues: { [key: string]: string };
      };
      const { tempToken, auth_token } = (
        getState() as { business: IBusinessState }
      ).business;
      headers.set(HeaderKeys.timestamp, `${hashValues[HeaderKeys.timestamp]}`);
      headers.set(HeaderKeys.signature, `${hashValues[HeaderKeys.signature]}`);
      headers.set(HeaderKeys.endpoint, `${hashValues[HeaderKeys.endpoint]}`);
      headers.set('X-Source', 'app');
      if (tempToken) {
        headers.set('Authorization', `Bearer ${tempToken}`);
      } else if (auth_token) {
        headers.set('Authorization', `Bearer ${auth_token}`);
      }

      return headers;
    },
  });
  const { body } = args;
  const url = typeof args === 'string' ? args : args.url;
  const hashValues = await createHash(body || {}, url);
  const result = await baseQuery(
    args,
    { ...api, extra: { hashValues } },
    extraOptions,
  );
  return result;
};
export default prepareHeaderBusiness;
