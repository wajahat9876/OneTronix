/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step1_Business_Details from '@src/components/steps/Auth/Signup/Auto/Step1_Business_Details';
import Step2_Verify_Email from '@src/components/steps/Auth/Signup/Auto/Step2_Verify_Email';
import Step3_Verify_Phone from '@src/components/steps/Auth/Signup/Auto/Step3_Verify_Phone';
import Step4_Choose_Main_Applicant from '@src/components/steps/Auth/Signup/Auto/Step4_Choose_Main_Applicant';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

const BusinessAuto = () => {
  const router = useRouter();
  // const businessDetails = useAppSelector(useBusinessDetails);
  // const { auth_token, data: businessData } = businessDetails;
  const { data: businessData, auth_token } = useSelector(useBusinessDetails);
  const { data: businessCurrentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });

  const { step, currentStepIndex, goTo } = useMultistepForm(
    [
      <Step1_Business_Details />, // 0
      <Step2_Verify_Email />, // 1
      <Step3_Verify_Phone />, // 2
      <Step4_Choose_Main_Applicant />, // 3
    ],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );

  useEffect(() => {
    if (goTo && businessData) {
      if (businessData.businessType === true) {
        if (businessData?.email && !businessData?.emailVerfied) {
          goTo?.(1);
        }
        if (businessData?.emailVerfied && !businessData?.phoneVerfied) {
          goTo?.(2);
        }
        if (businessData?.phoneVerfied && !businessData?.checkApplicant) {
          goTo?.(3);
        }
        if (
          !businessData?.emailVerfied &&
          !businessData?.phoneVerfied &&
          !auth_token
        ) {
          goTo?.(0);
        }
        if (
          businessData?.emailVerfied &&
          businessData?.phoneVerfied &&
          businessData?.checkApplicant &&
          !businessData?.isVerified
        ) {
          router.replace('/(auth)/KYC/Business');
        }
        if (!auth_token && currentStepIndex && currentStepIndex > 1) {
          router.replace('/(auth)/Welcome');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData, businessCurrentData]);

  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      <View className="flex-1">{step}</View>
      {/* <DismissKeyboardView>{step}</DismissKeyboardView> */}
    </>
  );
};

export default BusinessAuto;
