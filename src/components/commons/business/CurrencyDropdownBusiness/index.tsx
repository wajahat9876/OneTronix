/* eslint-disable import/order */
// eslint-disable-next-line prettier/prettier
import { useChangeActiveBusinessCurrencyMutation, useGetMulticurrencyTransactionQuery, useGetTargetedTransactionQuery, } from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import DropdownRNE from '@src/components/globals/DropdownRNE';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
// Adjust the import based on your library
interface CurrencyDropdownProps {
  style: any;
}
const CurrencyDropdownBusiness: React.FC<CurrencyDropdownProps> = ({
  style,
}) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const [changeActiveCurrency, { isLoading }] =
    useChangeActiveBusinessCurrencyMutation();
  const { getCurrencyCode } = useCurrencyFlag();
  const { refetch: transactionRefetch } = useGetTargetedTransactionQuery(
    { pageNo: 0, pageSize: 10 },
    { refetchOnMountOrArgChange: true },
  );
  const { refetch: MultiTransactionRefetch } =
    useGetMulticurrencyTransactionQuery(
      { pageNo: 0, pageSize: 10 },
      { refetchOnMountOrArgChange: true },
    );
  const { getFlagImage } = useCurrencyFlag();
  const accountData =
    businessData?.multiCurrencyAccounts
      ?.filter(item => item.active)
      .map(account => ({
        label: account.currencyCode,
        value: account.currencyCode,
        flag: getFlagImage(account.currencyCode), // Get the flag based on currencyCode
      })) || [];

  const [selectedCurrency, setSelectedCurrency] = useState<string | ''>('');

  useEffect(() => {
    if (businessData?.activeCurrency) {
      setSelectedCurrency(getCurrencyCode(businessData?.activeCurrency));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData]);

  const handleActiveCurrencyChange = async (item: string) => {
    try {
      const res = await changeActiveCurrency({
        currencyCode: item,
      }).unwrap();
      transactionRefetch();
      renderToastSuccess(res?.message || 'Successfully Changed');
    } catch (error: any) {
      if (businessData?.activeCurrency) {
        setSelectedCurrency(getCurrencyCode(businessData?.activeCurrency));
      }
      renderToastError(error?.data?.message);
    }
  };

  const renderItem = (item: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <Image
        source={item?.flag}
        style={{ width: 20, height: 20, marginRight: 10 }}
      />
      <Text style={{ fontSize: 16 }}>{item.label}</Text>
    </View>
  );

  return (
    <View style={{ width: '90%' }}>
      <DropdownRNE
        dropdownType="sm"
        data={accountData}
        value={selectedCurrency}
        disabled={isLoading}
        labelField="label"
        valueField="value"
        placeholder="Select Currency"
        style={{
          ...style,
        }}
        dropdownPosition="bottom"
        onChange={e => {
          handleActiveCurrencyChange(e?.value);
          setSelectedCurrency(e?.value);
        }}
        renderItem={renderItem}
        renderLeftIcon={() =>
          selectedCurrency && (
            <Image
              source={getFlagImage(selectedCurrency)}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
          )
        }
      />
    </View>
  );
};

export default CurrencyDropdownBusiness;
