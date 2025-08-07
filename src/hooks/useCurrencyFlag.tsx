// /src/hooks/useCurrencyFlag.ts
import cadFlag from '@assets/Flags PNG/CAD.png';
import chfFlag from '@assets/Flags PNG/CHF.png';
import czkFlag from '@assets/Flags PNG/CZK.png';
import dkkFlag from '@assets/Flags PNG/DKK.png';
import eurFlag from '@assets/Flags PNG/EUR.png';
import gbpFlag from '@assets/Flags PNG/GBP.png';
import hufFlag from '@assets/Flags PNG/HUF.png';
import nokFlag from '@assets/Flags PNG/NOK.png';
import plnFlag from '@assets/Flags PNG/PLN.png';
import ronFlag from '@assets/Flags PNG/RON.png';
import sekFlag from '@assets/Flags PNG/SEK.png';
import usdFlag from '@assets/Flags PNG/USD.png';
import { useMemo } from 'react';

const useCurrencyFlag = () => {
  // Define a memoized function to get the flag based on currency code
  const getFlagImage = useMemo(
    () => (currencyCode: string | undefined) => {
      switch (currencyCode) {
        case 'GBP':
          return gbpFlag;
        case 'USD':
          return usdFlag;
        case 'EUR':
          return eurFlag;
        case 'PLN':
          return plnFlag;
        case 'NOK':
          return nokFlag;
        case 'SEK':
          return sekFlag;
        case 'DKK':
          return dkkFlag;
        case 'CHF':
          return chfFlag;
        case 'CZK':
          return czkFlag;
        case 'HUF':
          return hufFlag;
        case 'RON':
          return ronFlag;
        case 'CAD':
          return cadFlag;

        // Add other cases as needed
        default:
          return null; // Fallback flag if no match
      }
    },
    [],
  );

  const getCurrencySymbol = useMemo(
    () => (currency: string | undefined) => {
      switch (currency) {
        case 'GBP':
          return '£';
        case 'EUR':
          return '€';
        case 'USD':
          return '$';
        case 'PLN':
          return 'zł';
        case 'NOK':
          return 'kr';
        case 'SEK':
          return 'kr';
        case 'DKK':
          return 'kr';
        case 'CHF':
          return 'Fr';
        case 'CZK':
          return 'Kč';
        case 'HUF':
          return 'Ft';
        case 'RON':
          return 'lei';
        case 'CAD':
          return '$';
        // Add other cases as needed
        default:
          return ''; // Fallback if no match
      }
    },
    [],
  );

  const getCurrencyCode = useMemo(
    () => (number: number | undefined) => {
      switch (number) {
        case 1:
          return 'GBP';
        case 2:
          return 'EUR';
        case 3:
          return 'USD';
        case 4:
          return 'PLN';
        case 5:
          return 'NOK';
        case 6:
          return 'SEK';
        case 7:
          return 'DKK';
        case 8:
          return 'CHF';
        case 9:
          return 'CZK';
        case 10:
          return 'HUF';
        case 11:
          return 'RON';
        case 12:
          return 'CAD';
        // Add other cases as needed
        default:
          return ''; // Fallback if no match
      }
    },
    [],
  );
  const getCurrencyNumber = useMemo(
    () => (currency: string | undefined) => {
      switch (currency) {
        case 'GBP':
          return 1;
        case 'EUR':
          return 2;
        case 'USD':
          return 3;
        case 'PLN':
          return 4;
        case 'NOK':
          return 5;
        case 'SEK':
          return 6;
        case 'DKK':
          return 7;
        case 'CHF':
          return 8;
        case 'CZK':
          return 9;
        case 'HUF':
          return 10;
        case 'RON':
          return 11;
        case 'CAD':
          return 12;
        // Add other cases as needed
        default:
          return null; // Fallback if no match
      }
    },
    [],
  );

  return {
    getFlagImage,
    getCurrencySymbol,
    getCurrencyCode,
    getCurrencyNumber,
  };
};
export default useCurrencyFlag;
// src/utils/currencyUtils.ts
