/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable camelcase */

import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useResetBusinessKycMutation } from '@/store/api/kyc/businessKycApi';
import { useBusinessDetails } from '@/store/selectors/business/business';
import ProcessingIcon from '@assets/icons/ProcessingIcon.svg';
import Image from '@assets/images/BackgroundImage/KycBackground.png';
import BackgroundImage from '@src/components/globals/BackgroundImage';
import Button from '@src/components/globals/Button';
import { SafeAreaView, StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { kycStyles } from '@src/styles/KYC';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import React from 'react';
import { View } from 'react-native';

const Step3_Waiting = ({ goTo }: MultiStepFormProps) => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { handleBusinessLogout } = useBusinessLogout();
  const [resetKyc, { isLoading }] = useResetBusinessKycMutation();
  // eslint-disable-next-line consistent-return
  const checkStatus = () => {
    refetch();
  };
  const handleReset = async () => {
    try {
      const res = await resetKyc({}).unwrap();
      renderToastSuccess(res?.message);
      goTo?.(0);
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  return (
    <>
      <BackgroundImage src={Image} />
      <SafeAreaView style={styles.container}>
        <View style={{ marginTop: getRespValue(150) }}>
          <ProcessingIcon />
        </View>
        <Text style={styles.title}>{` Processing information... `}</Text>
        <Text
          style={styles.subtitle}
        >{` Your KYC submission is under review. This usually takes some time, Thanks for your patience!`}</Text>

        <View style={{ ...kycStyles.button, bottom: vs(125) }}>
          <Button
            btnColor="rgba(128, 128, 128, 0.5)"
            btnTitleColor="white"
            btnTitle="Retry"
            loading={isLoading}
            onClick={() => {
              handleReset();
            }}
          />
        </View>
        <View style={{ ...kycStyles.button, bottom: vs(56) }}>
          <Button
            btnColor="rgba(128, 128, 128, 0.5)"
            btnTitleColor="white"
            btnTitle="Logout"
            onClick={() => {
              handleBusinessLogout();
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontFamily: 'poppins-semibold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: vs(32),
    marginLeft: hs(8),
    marginRight: hs(8),
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.theme.white,
    textAlign: 'center',
    marginTop: vs(32),
  },
});
export default Step3_Waiting;
