/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step0_Privacy_Policy from '@src/components/steps/Auth/Signup/Step0_Privacy_Policy';
import Step1_ChooseAccountType from '@src/components/steps/Auth/Signup/Step1_Choose_Account_Type';
import Step3_Create_Your_Account from '@src/components/steps/Auth/Signup/Step3_Create_Your_Account';
import Step3_Terms_And_Conditions from '@src/components/steps/Auth/Signup/Step3_Terms_And_Conditions';
import Step4_Choose_Account_Method from '@src/components/steps/Auth/Signup/Step4_Choose_Account_Method';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const Business = () => {
  const router = useRouter();
  const { data: businessData, auth_token } = useAppSelector(useBusinessDetails);
  const [showScreen, setShowScreen] = useState(false);
  const { data: businessCurrentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { step, goTo, currentStepIndex } = useMultistepForm(
    [
      <Step0_Privacy_Policy />,
      <Step1_ChooseAccountType />,
      // <Step2_Choose_Business_Type />,
      <Step3_Create_Your_Account />,
      <Step3_Terms_And_Conditions />,
      <Step4_Choose_Account_Method />,
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
      if (businessData?.businessType === false) {
        router.replace('/(auth)/Signup/Business/Manual');
      } else if (businessData?.businessType === true) {
        router.replace('/(auth)/Signup/Business/Auto');
      } else goTo?.(0);
    }
    setShowScreen(true);
  }, [businessData?.businessType]);
  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      {showScreen && <View className="flex-1">{step}</View>}
    </>
  );
};

export default Business;
