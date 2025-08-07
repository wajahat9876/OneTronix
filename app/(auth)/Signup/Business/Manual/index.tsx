/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step1_Business_Details from '@src/components/steps/Auth/Signup/Manual/Step1_Business_Details';
import Step2_Verify_Email from '@src/components/steps/Auth/Signup/Manual/Step2_Verify_Email';
import Step3_Verify_Phone from '@src/components/steps/Auth/Signup/Manual/Step3_Verify_Phone';
import Step4_Director_Details from '@src/components/steps/Auth/Signup/Manual/Step4_Director_Details';
import Step5_Select_Main_Applicant from '@src/components/steps/Auth/Signup/Manual/Step5_Select_Main_Applicant';
import Step6_Add_Shareholder_Details from '@src/components/steps/Auth/Signup/Manual/Step6_Add_Shareholder_Details';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const BusinessManual = () => {
  const router = useRouter();
  const businessDetails = useAppSelector(useBusinessDetails);
  const { auth_token, data: businessData } = businessDetails;
  const { data: businessCurrentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { step, currentStepIndex, goTo } = useMultistepForm(
    [
      <Step1_Business_Details />, // 0
      <Step2_Verify_Email />, // 1
      <Step3_Verify_Phone />, // 2
      <Step4_Director_Details />, // 3
      <Step5_Select_Main_Applicant />, // 4
      <Step6_Add_Shareholder_Details />, // 5
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
      if (businessData.businessType === false) {
        // if (!businessData?.emailVerfied && currentStepIndex !== 2)
        if (!businessData?.emailVerfied) {
          goTo?.(1);
        }
        if (businessData?.emailVerfied && !businessData?.phoneVerfied) {
          goTo?.(2);
        }
        if (
          businessData?.phoneVerfied &&
          (businessData?.numberOfDirectors !==
            businessData?.allDirectors?.length ||
            !businessData?.checkApplicant)
        ) {
          goTo?.(3);
        }

        if (
          businessData?.checkApplicant &&
          businessData?.numberOfDirectors ===
            businessData?.allDirectors?.length &&
          !businessData?.shareHolder
        ) {
          goTo?.(5);
        }
        if (
          businessData?.emailVerfied &&
          businessData?.phoneVerfied &&
          businessData?.shareHolder
        ) {
          router.replace('/(auth)/KYC/Business');
        }
        if (
          !businessData?.emailVerfied &&
          !businessData?.phoneVerfied &&
          !auth_token
        ) {
          goTo?.(0);
        }
        if (!auth_token && currentStepIndex && currentStepIndex > 1) {
          router.replace('/(auth)/Welcome');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData]);

  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default BusinessManual;
