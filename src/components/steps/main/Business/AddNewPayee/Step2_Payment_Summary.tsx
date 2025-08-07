/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useGetMultiTransactionOtpMutation,
  useGetTransactionOtpMutation,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useCapitalizeFirstWord from '@src/hooks/useCapitalizeFirst';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Step2_Payment_Summary = ({ goTo }: MultiStepFormProps) => {
  const { beneficiaryDetails, data: businessData } =
    useAppSelector(useBusinessDetails);
  const [transactionOtp, { isLoading }] = useGetTransactionOtpMutation();
  const [multiTransactionOtp, { isLoading: multiLoading }] =
    useGetMultiTransactionOtpMutation();
  const { getCurrencySymbol, getCurrencyCode } = useCurrencyFlag();
  const { capitalizeFirstWord } = useCapitalizeFirstWord();
  const handleTransactionOtp = async () => {
    try {
      const res = await transactionOtp({}).unwrap();
      renderToastSuccess(res?.message);
      goTo?.(3);
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const handleMultiTransactionOtp = async () => {
    try {
      const res = await multiTransactionOtp({}).unwrap();
      renderToastSuccess(res?.message);
      goTo?.(3);
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };

  const handleSubmit = () => {
    if (businessData?.activeCurrency === 1) {
      handleTransactionOtp();
    } else {
      handleMultiTransactionOtp();
    }
  };
  return (
    <ScreenAuth
      title="Pay & Transfer"
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
        goTo?.(1);
      }}
    >
      <Text
        style={{
          marginTop: vs(30),
          alignSelf: 'center',
          marginLeft: hs(0),
          color: 'black',
          fontWeight: '600',
          fontSize: 25,
        }}
      >
        Payment Summary
      </Text>
      {businessData?.activeCurrency === 1 && (
        <View
          style={{
            flex: 1,
            paddingLeft: hs(30),
            paddingRight: hs(30),
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <Text style={styles.subTitle}>Name:</Text>
            <Text style={styles.txt}>
              {capitalizeFirstWord(beneficiaryDetails?.creditorName)}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginTop: 10,
              opacity: 0.2,
              marginBottom: 10,
            }}
          />

          <>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.subTitle}>Account Number:</Text>
              <Text style={styles.txt}>{beneficiaryDetails?.accountNo}</Text>
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                marginTop: 10,
                opacity: 0.2,
                marginBottom: 10,
              }}
            />
          </>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.subTitle}>Amount:</Text>
            <Text style={styles.txt}>
              {getCurrencySymbol(getCurrencyCode(businessData?.activeCurrency))}{' '}
              {Number(beneficiaryDetails?.Amount).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginTop: 10,
              opacity: 0.2,
              marginBottom: 10,
            }}
          />

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.subTitle}>Sort Code:</Text>
            <Text style={styles.txt}>
              {beneficiaryDetails?.sortCode || 'NA'}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginTop: 10,
              opacity: 0.2,
              marginBottom: 10,
            }}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.subTitle}>Reference:</Text>
            <Text style={styles.txt}>{beneficiaryDetails?.reference}</Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginTop: 10,
              opacity: 0.2,
              marginBottom: 10,
            }}
          />

          <View style={{ ...globalStyle.buttonContinue, bottom: vs(26) }}>
            <Button
              btnTitle="Continue"
              loading={isLoading || multiLoading}
              onClick={() => {
                handleSubmit();
              }}
            />
          </View>
        </View>
      )}
      {businessData?.activeCurrency !== 1 && (
        <View
          style={{
            flex: 1,
            paddingLeft: hs(30),
            paddingRight: hs(30),
            marginTop: 30,
          }}
        >
          {beneficiaryDetails?.name && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.subTitle}>Name:</Text>
                <Text style={styles.txt}>{beneficiaryDetails?.name}</Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  marginTop: 10,
                  opacity: 0.2,
                  marginBottom: 10,
                }}
              />
            </>
          )}

          {beneficiaryDetails?.iban && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.subTitle}>IBAN:</Text>
                <Text style={styles.txt}>{beneficiaryDetails?.iban}</Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  marginTop: 10,
                  opacity: 0.2,
                  marginBottom: 10,
                }}
              />
            </>
          )}
          {beneficiaryDetails?.accountNumber && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.subTitle}>Account Number:</Text>
                <Text style={styles.txt}>
                  {beneficiaryDetails?.accountNumber}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  marginTop: 10,
                  opacity: 0.2,
                  marginBottom: 10,
                }}
              />
            </>
          )}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.subTitle}>Amount:</Text>
            <Text style={styles.txt}>
              {getCurrencySymbol(getCurrencyCode(businessData?.activeCurrency))}{' '}
              {Number(beneficiaryDetails?.Amount).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginTop: 10,
              opacity: 0.2,
              marginBottom: 10,
            }}
          />

          <View style={{ ...globalStyle.buttonContinue, bottom: vs(26) }}>
            <Button
              btnTitle="Continue"
              loading={isLoading || multiLoading}
              onClick={() => {
                handleSubmit();
              }}
            />
          </View>
        </View>
      )}
    </ScreenAuth>
  );
};

export default Step2_Payment_Summary;
const styles = StyleSheet.create({
  txt: {
    fontSize: getRespValue(18),
    fontWeight: '400',
  },
  subTitle: {
    fontSize: getRespValue(18),
    fontWeight: '600',
  },
});
