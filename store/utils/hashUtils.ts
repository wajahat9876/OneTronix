/* eslint-disable import/prefer-default-export */

import HeaderKeys from '@src/constants/HeaderKeys';
import moment from 'moment';
import { hmacSHA256 } from '../../modules/expo-encryption';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createHash = async (apibody: any, endpoint: string) => {
  // const currentDate = moment().utc().format();
  // const currentDate = Date.now() / 1000;
  const currentDate = moment.utc().format();

  const stableAppSecret = [
    process.env.EXPO_PUBLIC_HMAC_KEY1,
    process.env.EXPO_PUBLIC_HMAC_KEY2,
    process.env.EXPO_PUBLIC_HMAC_KEY3,
    process.env.EXPO_PUBLIC_HMAC_KEY4,
    process.env.EXPO_PUBLIC_HMAC_KEY5,
    process.env.EXPO_PUBLIC_HMAC_KEY6,
    process.env.EXPO_PUBLIC_HMAC_KEY7,
    process.env.EXPO_PUBLIC_HMAC_KEY8,
  ];

  const stringifyApiBody =
    Object.keys(apibody)?.length > 0 ? JSON.stringify(apibody) : '';
  const lastEndpoint = endpoint.match(/\/[^/]*$/)?.[0];

  const data = `${currentDate}${lastEndpoint}${stringifyApiBody}`;

  const hash = await hmacSHA256(stableAppSecret as string[], data);
  const signature = `${hash}`;

  return {
    [HeaderKeys.endpoint]: lastEndpoint,
    [HeaderKeys.timestamp]: currentDate,
    [HeaderKeys.signature]: signature,
  };
};
