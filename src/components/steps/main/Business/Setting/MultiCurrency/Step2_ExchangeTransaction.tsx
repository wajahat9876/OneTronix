/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/order */
/* eslint-disable camelcase */

import { useExchangeTransactionsBusinessMutation } from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Button from '@src/components/globals/Button';
import OTPTimer from '@src/components/globals/OTPTimer';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import useFormatDate from '@src/hooks/useFormatDate';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import ExchangeIcon from 'assets/icons/exchange.png';
import { useState } from 'react';
import { Image, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SettingProps } from '../type';

const Step2_ExchangeTransaction = ({
  goTo,

  back,
}: SettingProps) => {
  const { formatDate, formatTime } = useFormatDate();
  const { quoteDetails } = useAppSelector(useBusinessDetails);
  const { getFlagImage, getCurrencyNumber } = useCurrencyFlag();
  const [exchangeTransaction, { isLoading }] =
    useExchangeTransactionsBusinessMutation();
  const [otpExpired, setOTPExpired] = useState(false);
  const [timerKey] = useState(Date.now());
  const handleSubmit = async () => {
    try {
      const res = await exchangeTransaction({
        quoteId: quoteDetails?.quoteId,
        sellAccount: getCurrencyNumber(quoteDetails?.sellCurrency),
        buyAccount: getCurrencyNumber(quoteDetails?.buyCurrency),
        sellAmount: quoteDetails?.sellAmount,
        requestQuote: quoteDetails,
      }).unwrap();
      goTo?.(3);
      renderToastSuccess(res?.message || 'Success');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Failed to exchange');
    }
  };

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Foreign Currency Exchange"
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
          goTo?.(0);
        }}
      >
        <View style={styles.container}>
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 20,
              paddingLeft: 10,
              paddingBottom: 10,
            }}
          >
            Currency Exchange
          </Text>
          <View style={styles.Card}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                <Image
                  source={getFlagImage(quoteDetails?.sellCurrency)}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.text}>{quoteDetails?.sellCurrency}</Text>
              </View>
              <Image source={ExchangeIcon} />
              <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                <Image
                  source={getFlagImage(quoteDetails?.buyCurrency)}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.text}>{quoteDetails?.buyCurrency}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.txts}>Currency Pair:</Text>
              <Text style={styles.txt}>{quoteDetails?.currencyPair}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.txts}>Exchange Rate:</Text>
              <Text style={styles.txt}>
                {quoteDetails?.exchangeRate ?? 0} {quoteDetails?.buyCurrency}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.txts}>Exchange Fee:</Text>
              <Text style={styles.txt}>
                {quoteDetails?.fee ?? 0} {quoteDetails?.sellCurrency}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.txts}>Sell Amount:</Text>
              <Text style={styles.txt}>
                {quoteDetails?.sellAmount ?? 0} {quoteDetails?.sellCurrency}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.txts}>Buy Amount:</Text>
              <Text style={styles.txt}>
                {quoteDetails?.buyAmount ?? 0} {quoteDetails?.buyCurrency}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.txts}>Expire At:</Text>
              <Text style={styles.txt}>
                {formatDate(quoteDetails?.expiresAt)}{' '}
                {formatTime(quoteDetails?.expiresAt)}
              </Text>
            </View>
          </View>
          {!otpExpired ? (
            <View style={{ alignSelf: 'center' }}>
              <OTPTimer
                key={timerKey}
                time={28}
                light
                text="Expired in "
                handleExpired={() => {
                  back?.();
                  setOTPExpired(true);
                }}
              />
            </View>
          ) : (
            <></>
          )}
          <View style={globalStyle.buttonContinue}>
            <Button
              btnTitle="Submit"
              onClick={handleSubmit}
              loading={isLoading}
            />
          </View>
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: vs(24),
    paddingLeft: hs(16),
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  Card: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%', // Adjust width as needed
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginTop: 5,
    marginBottom: 30,
  },
  text: {
    paddingHorizontal: 5,
    fontSize: 18,
    marginBottom: 30,
    fontWeight: '600',
  },
  txt: {
    fontSize: getRespValue(16),
    marginTop: 8,
  },
  txts: {
    fontSize: getRespValue(18),
    marginTop: 8,
    fontWeight: '600',
  },
});
export default Step2_ExchangeTransaction;
