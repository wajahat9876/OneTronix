/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable camelcase */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useResetBusinessKycMutation } from '@/store/api/kyc/businessKycApi';
import { useBusinessDetails } from '@/store/selectors/business/business';
import RedCross from '@assets/icons/redCross.png';
import backImage from '@assets/images/BackgroundImage/KycBackground.png';
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
import React from 'react';
import { Image, View } from 'react-native';

const Step4_KYC_Failed = ({ goTo }: MultiStepFormProps) => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const [resetKyc, { isLoading }] = useResetBusinessKycMutation();
  const { handleBusinessLogout } = useBusinessLogout();
  // eslint-disable-next-line consistent-return
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
      <BackgroundImage src={backImage} />
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            ...kycStyles.heading,
            marginTop: vs(100),
            marginLeft: hs(0),
            color: Colors.light.theme.white,
          }}
        >
          KYC Failed
        </Text>
        <View style={styles.checkIcon}>
          <Image source={RedCross} style={{ width: 100, height: 100 }} />
        </View>

        <Text style={styles.title}>ID Verification Failed</Text>
        <Text
          style={styles.subtitle}
        >{` The Document you provided is Failed To Verify.`}</Text>

        <View style={{ ...kycStyles.button, bottom: vs(100) }}>
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
        <View style={{ ...kycStyles.button, bottom: vs(36) }}>
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
  checkIcon: {
    marginTop: vs(56),
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
export default Step4_KYC_Failed;
