/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import { useCreateCurrencyAccountMutation } from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import cadFlag from '@assets/Flags PNG/CAD.png';
import chfFlag from '@assets/Flags PNG/CHF.png';
import czkFlag from '@assets/Flags PNG/CZK.png';
import dkkFlag from '@assets/Flags PNG/DKK.png';
import hufFlag from '@assets/Flags PNG/HUF.png';
import nokFlag from '@assets/Flags PNG/NOK.png';
import plnFlag from '@assets/Flags PNG/PLN.png';
import ronFlag from '@assets/Flags PNG/RON.png';
import sekFlag from '@assets/Flags PNG/SEK.png';
import EurFlag from '@assets/flags/EUR.png';
import GbpFlag from '@assets/flags/GBP.png';
import UsdFlag from '@assets/flags/USD.png';
import ActivateCurrency from '@src/components/commons/main/ActivateNewCurrency';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import React from 'react';
import { useSelector } from 'react-redux';

const CreateAccount = ({ goTo }: MultiStepFormProps) => {
  const { data: businessData } = useSelector(useBusinessDetails);
  const [createBusinessBankAccount, { isLoading }] =
    useCreateCurrencyAccountMutation();
  const { getCurrencyNumber } = useCurrencyFlag();
  const handleCreate = async (currencyCode: string) => {
    const currencyNumber = getCurrencyNumber(currencyCode);
    try {
      const res = await createBusinessBankAccount({
        currencyCode: currencyNumber,
      }).unwrap();
      renderToastSuccess(res?.message || 'Successfully created');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };

  const currencies = [
    { code: 'GBP', flag: GbpFlag },
    { code: 'EUR', flag: EurFlag },
    { code: 'USD', flag: UsdFlag },
    { code: 'PLN', flag: plnFlag },
    { code: 'NOK', flag: nokFlag },
    { code: 'SEK', flag: sekFlag },
    { code: 'DKK', flag: dkkFlag },
    { code: 'CHF', flag: chfFlag },
    { code: 'CZK', flag: czkFlag },
    { code: 'HUF', flag: hufFlag },
    { code: 'RON', flag: ronFlag },
    { code: 'CAD', flag: cadFlag },
  ];

  return (
    <ScreenAuth
      title="Create Account"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => goTo?.(0)}
    >
      <ActivateCurrency
        isLoading={isLoading}
        currencies={currencies}
        data={businessData}
        handleCreate={handleCreate}
      />
    </ScreenAuth>
  );
};

export default CreateAccount;
