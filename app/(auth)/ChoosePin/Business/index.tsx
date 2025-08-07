/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step1_Choose_Pin from '@src/components/steps/Auth/ChoosePin/Step1_Choose_Pin';
import Step2_Confirm_Pin from '@src/components/steps/Auth/ChoosePin/Step2_Confirm_Pin';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const ChoosePin = () => {
  const { data: businessData, auth_token } = useAppSelector(useBusinessDetails);
  const { currentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const router = useRouter();
  const { step, goTo } = useMultistepForm(
    [<Step1_Choose_Pin />, <Step2_Confirm_Pin />],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );
  useEffect(() => {
    if (!auth_token) {
      router.replace('/(auth)/Welcome');
    }
    if (businessData) {
      if (businessData?.isPinSet) {
        router.replace('/(main)/Business/Home');
      } else {
        goTo?.(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData?.isPinSet, auth_token]);
  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default ChoosePin;
