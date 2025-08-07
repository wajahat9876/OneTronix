/* eslint-disable no-restricted-globals */
/* eslint-disable import/order */
/* eslint-disable camelcase */

import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import {
  useExchangeQuoteBusinessMutation,
  useGetPendingExchangeTransactionsQuery,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import ErrorSvg from '@assets/BankStatement/error-blue.svg';
import CurrencyInput from '@src/components/commons/main/CurrencyInput';
import Button from '@src/components/globals/Button';
import DropdownRNE from '@src/components/globals/DropdownRNE';
import DismissKeyboardView from '@src/components/globals/HideKeyboard';
import LoadingModal from '@src/components/globals/LoadingModal';
import PendingTransactionsTable from '@src/components/globals/PendingTransactionsTable';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { ScrollView, StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { useEffect, useMemo, useState } from 'react';
import { Image, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SettingProps } from '../type';

interface CurrencyItem {
  label: string;
  value: string;
  flag: any;
}
const currencyMinimumValues = {
  CAD: 17,
  CHF: 11,
  CZK: 279,
  DKK: 86,
  GBP: 10,
  HUF: 4411,
  NOK: 134,
  PLN: 52,
  RON: 54,
  SEK: 135,
  USD: 13,
  EUR: 12,
};

const Step1_MultiCurrency = ({ parentGoto, goTo }: SettingProps) => {
  const [sourceValue, setSourceValue] = useState('');
  const [destValue, setDestValue] = useState('');
  const [amount, setAmount] = useState('');
  const { data: businessData, auth_token } = useAppSelector(useBusinessDetails);
  const [exchangeQuote, { isLoading }] = useExchangeQuoteBusinessMutation();
  const [selectedSourceFlag, setSelectedSourceFlag] = useState(null);
  const [selectedDestFlag, setSelectedDestFlag] = useState(null);
  const { getFlagImage } = useCurrencyFlag();
  const [sourceCurrency, setSourceCurrency] = useState();
  const [destCurrency, setDestCurrency] = useState('');
  const { refetch } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });

  const { getCurrencyNumber } = useCurrencyFlag();
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Check if multi currency account exist
  const isMultiCurrencyExist = useMemo(() => {
    const activeApprovedAccounts =
      businessData?.multiCurrencyAccounts?.filter(
        item => item.active && item.approved,
      ) ?? [];

    return activeApprovedAccounts.length >= 2;
  }, [businessData?.multiCurrencyAccounts]);
  // Map only Active Accounts
  const updatedsourceData: CurrencyItem[] = useMemo(() => {
    return (
      businessData?.multiCurrencyAccounts
        ?.filter(item => item.active && item.approved)
        .map(account => ({
          label: account.currencyCode,
          value: account.currencyCode,
          flag: getFlagImage(account.currencyCode),
        })) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData?.multiCurrencyAccounts]);

  const handleSubmit = async (scheduleLater: boolean) => {
    const checkCurrency = destCurrency;
    // Get the minimum value for the selected currency
    const minValue = currencyMinimumValues[checkCurrency];

    if (!minValue) {
      renderToastError(`No minimum value found for currency ${checkCurrency}`);
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      renderToastError('Invalid amount');
      return;
    }
    // Compare with minimum
    if (parsedAmount < minValue) {
      renderToastError(`Amount must be at least ${minValue} ${checkCurrency}`);
      return;
    }

    try {
      const res = await exchangeQuote({
        amount: parsedAmount.toString(),
        sellCurrency: getCurrencyNumber(sourceCurrency),
        buyCurrency: getCurrencyNumber(destCurrency),
        scheduleLater: scheduleLater?.toString(),
      }).unwrap();
      goTo?.(1);
      renderToastSuccess(res?.message || 'Success');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Failed to exchange');
    }
  };
  // for Flags
  const renderItem = (item: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: getRespValue(10),
        }}
      >
        <Image
          source={item?.flag}
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
        <Text>{item.label}</Text>
      </View>
    );
  };
  const handleAmountChange = (value: any) => {
    setAmount(value);
  };

  const {
    data: pendingTransactions,
    refetch: pendingRefetch,
    isLoading: pendingLoading,
  } = useGetPendingExchangeTransactionsQuery(
    {
      pageNumber: 1,
      pageSize: 100,
    },
    { refetchOnMountOrArgChange: true },
  );
  const headers = [
    { label: 'Sell Currency', key: 'sellCurrency' },
    { label: 'Buy Currency', key: 'buyCurrency' },
    { label: 'Sell Amount', key: 'sellAmount' },
    { label: 'Buy Amount', key: 'buyAmount' },
    { label: 'Status', key: 'status' },
    { label: 'Date & Time', key: 'updatedAt' },
  ];
  useEffect(() => {
    pendingRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Currency Exchange"
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
        back={() => {
          parentGoto?.(0);
        }}
      >
        {!isMultiCurrencyExist && (
          <View
            style={{
              marginTop: vs(120),
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              height: '100%',
              backgroundColor: Colors.light.theme.blurEffectColor,
            }}
          >
            <View
              style={{
                flex: 1,
                paddingHorizontal: ms(40),
              }}
            >
              <View style={{ flex: 0.3 }} />
              <View
                style={{
                  flex: 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ErrorSvg width={hs(50)} height={vs(50)} />
              </View>
              <View
                style={{
                  flex: 0.15,
                }}
              >
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 15,
                    textAlign: 'center',
                    paddingVertical: ms(10),
                  }}
                >
                  You don&apos;t have any additional account added. Create a new
                  account to enable currency exchange feature.
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  onClick={() => {
                    goTo?.(2);
                  }}
                  btnTitle="Add"
                />
              </View>
            </View>
          </View>
        )}

        <ScrollView style={styles.container}>
          <DismissKeyboardView>
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 20,
                paddingLeft: 20,
                paddingBottom: 10,
              }}
            >
              Currency Exchange
            </Text>
            <View style={styles.Card}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: vs(5),
                  marginLeft: vs(25),
                }}
              >
                <Text style={styles.toFromTxt}>From</Text>
                <Text
                  style={[styles.toFromTxt, { marginLeft: getRespValue(130) }]}
                >
                  To
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <DropdownRNE
                  dropdownType="sm"
                  data={updatedsourceData}
                  placeholder="Source"
                  labelField="label"
                  valueField="value"
                  value={sourceValue}
                  style={{
                    width: '36%',
                    borderColor: 'transparent',
                    borderBottomColor: 'transparent',
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  itemContainerStyle={{ borderRadius: 10 }}
                  dropdownPosition="bottom"
                  onChange={e => {
                    setSelectedSourceFlag(getFlagImage(e?.label));
                    setSourceCurrency(e?.label);
                    setSourceValue(e.value);
                    setDestValue('');
                    setSelectedDestFlag(null);
                    setDestCurrency('');
                  }}
                  renderItem={renderItem}
                  renderLeftIcon={() =>
                    selectedSourceFlag && (
                      <Image
                        source={selectedSourceFlag}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: getRespValue(15),
                        }}
                      />
                    )
                  }
                  containerStyle={{
                    borderRadius: 10,
                  }}
                />
                <DropdownRNE
                  dropdownType="sm"
                  data={updatedsourceData.filter(
                    item => item.value !== sourceValue,
                  )}
                  labelField="label"
                  valueField="value"
                  placeholder="Destination"
                  value={destValue}
                  disabled={!sourceValue}
                  dropdownPosition="bottom"
                  onChange={e => {
                    setSelectedDestFlag(getFlagImage(e?.label));
                    setDestCurrency(e?.label);
                    setDestValue(e.value);
                  }}
                  style={{
                    width: '40%',
                    borderColor: 'transparent',
                    marginLeft: 10,
                    borderBottomColor: 'transparent',
                  }}
                  itemContainerStyle={{ borderRadius: 10 }}
                  containerStyle={{ borderRadius: 10 }}
                  renderItem={renderItem}
                  renderLeftIcon={() =>
                    selectedDestFlag && (
                      <Image
                        source={selectedDestFlag}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: getRespValue(15),
                        }}
                      />
                    )
                  }
                />
              </View>
              <CurrencyInput
                containerStyle={{
                  borderBottomColor: 'gray',
                  padding: 10,
                  marginTop: 40,
                  textAlign: 'center',
                  backgroundColor: '#F5F5F5',
                  borderRadius: 10,
                  width: '75%',
                  alignSelf: 'center',
                }}
                currency={destCurrency}
                onValueChange={handleAmountChange}
              />
              <Text
                style={{
                  fontSize: 10,
                  paddingHorizontal: 40,
                  marginTop: 5,
                  color: 'gray',
                }}
              >
                Note: The entered amount corresponds to the destination
                currency.{'\n'}Scheduled exchange will be processed at 9:00 AM.
              </Text>
            </View>
            <View style={styles.buttonsRow}>
              <Button
                disabled={!destCurrency || !amount}
                btnTitle="Request"
                onClick={() => {
                  handleSubmit(false);
                }}
              />
              <Button
                disabled={!destCurrency || !amount}
                btnTitle="Schedule"
                onClick={() => {
                  handleSubmit(true);
                }}
              />
            </View>
          </DismissKeyboardView>
          <Text style={styles.tableheading}>Pending Exchanges</Text>
          <Text
            onPress={() => {
              parentGoto?.(13);
            }}
            style={{
              paddingHorizontal: 20,
              fontSize: 12,
              paddingVertical: 5,
              color: Colors.light.theme.eccRedColor,
            }}
          >
            For exchange cut off time click here
          </Text>
          <PendingTransactionsTable
            data={pendingTransactions?.data?.contacts}
            headers={headers}
          />
        </ScrollView>

        <LoadingModal isLoading={isLoading || pendingLoading} />
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  btn1: {
    width: 150,
    marginHorizontal: 5,
    height: 50,
    bottom: 2,
  },
  btn2: {
    width: 150,
    marginHorizontal: 5,
    height: 50,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: hs(30),
    // marginBottom: vs(32),
    marginLeft: hs(32),
    marginRight: hs(16),
  },
  container: {
    flex: 1,
    paddingTop: vs(24),
    paddingHorizontal: hs(5),
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  toFromTxt: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  txtAmount: {
    borderBottomColor: 'gray',
    padding: 10,
    marginTop: 40,
    textAlign: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    width: '70%',
    alignSelf: 'center',
  },

  Card: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 10,
    width: '90%', // Adjust width as needed
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginTop: 5,
    marginBottom: 30,
  },
  tableheading: {
    marginTop: vs(50),
    marginLeft: hs(20),
    fontSize: ms(20),
    fontWeight: 600,
    paddingBottom: vs(10),
  },
});
export default Step1_MultiCurrency;
