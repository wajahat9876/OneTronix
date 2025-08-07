/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step1_Select_Country from '@src/components/steps/Auth/KYC/Step1_Select_Country';
import Step2_Iframe_Call from '@src/components/steps/Auth/KYC/Step2_Iframe_Call';
import Step3_Waiting from '@src/components/steps/Auth/KYC/Step3_Waiting';
import Step4_KYC_Failed from '@src/components/steps/Auth/KYC/Step4_KYC_Failed';
import Step5_KYC_Alert from '@src/components/steps/Auth/KYC/Step5_KYC_Alert';
import Step6_KYC_Reject from '@src/components/steps/Auth/KYC/Step6_KYC_Reject';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const KYC = () => {
  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);
  const { data: businessCurrentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const [showScreen, setShowScreen] = useState(false);
  const router = useRouter();
  const { step, goTo } = useMultistepForm(
    [
      <Step1_Select_Country />, // 0
      <Step2_Iframe_Call />, // 1
      <Step3_Waiting />, // 2
      <Step4_KYC_Failed />, // 3
      <Step5_KYC_Alert />, // 4
      <Step6_KYC_Reject />, // 5
    ],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );
  useEffect(() => {
    if (businessData) {
      if (!auth_token || auth_token === '') {
        router.replace('/(auth)/Welcome');
      }
      if (businessData?.directorVerified) {
        router.replace('/(auth)/UploadBusinessDocuments');
      }
      if (businessData?.kyc?.kycStatus === 'Reject') {
        goTo?.(5);
      }
      // if (businessData?.kyc?.kycStatus === 'Alert') {
      //   goTo?.(4);
      // }
      if (businessData?.kyc?.kycStatus === 'Failed') {
        goTo?.(3);
      }
      if (businessData?.kyc?.kycStatus === 'Pending') {
        goTo?.(2);
      }
      if (
        businessData?.kyc?.kycStatus === 'Not-Started' ||
        !businessData?.kyc?.kycStatus
      ) {
        goTo?.(0);
      }
      setShowScreen(true);
    }
  }, [
    businessData?.kyc?.kycStatus,
    businessData?.directorVerified,
    businessCurrentData,
    auth_token,
  ]);

  // }, [businessData, businessCurrentData]);
  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      {showScreen && <View className="flex-1">{step}</View>}
    </>
  );
};

export default KYC;
