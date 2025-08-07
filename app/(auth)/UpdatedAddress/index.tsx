/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step1_UpdateAddress from '@src/components/steps/Auth/UpdateAddress/Step1_UpdateAddress';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const UpdateAddress = () => {
  const { data: businessData, auth_token } = useAppSelector(useBusinessDetails);
  const { currentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const router = useRouter();
  const { step } = useMultistepForm([<Step1_UpdateAddress />], {
    newHook: true,
    animatedViewProps: {
      ...pageTransitionAnimation,
    },
  });
  useEffect(() => {
    if (businessData?.mainApplicantAddress && businessData?.isPinSet) {
      router.replace('/(main)/Business/Home');
    } else if (businessData?.mainApplicantAddress && !businessData?.isPinSet) {
      router.replace('/(auth)/ChoosePin/Business');
    }
  }, [businessData?.mainApplicantAddress, businessData?.isPinSet]);
  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default UpdateAddress;
