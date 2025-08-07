/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Image from '@assets/images/BackgroundImage/Background.png';
import BackgroundImage from '@src/components/globals/BackgroundImage';
import Step1_Email from '@src/components/steps/Auth/ForgotPassword/Step1_Email';
import Step2_OTPEmail from '@src/components/steps/Auth/ForgotPassword/Step2_OTPEmail';
import Step3_NewPassword from '@src/components/steps/Auth/ForgotPassword/Step3_NewPassword';
import Step4_PasswordReset from '@src/components/steps/Auth/ForgotPassword/Step4_PasswordReset';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import React, { useState } from 'react';
import { View } from 'react-native';

const Forgot = () => {
  const [checkData, setCheckData] = useState<{
    isPhone: boolean;
    email: string;
    phone: string;
  }>({
    isPhone: false,
    email: '',
    phone: '',
  });
  const { step } = useMultistepForm(
    [
      <Step1_Email setCheckData={setCheckData} />,
      <Step2_OTPEmail setCheckData={setCheckData} checkData={checkData} />,
      <Step3_NewPassword setCheckData={setCheckData} checkData={checkData} />,
      <Step4_PasswordReset />,
    ],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );
  return (
    <>
      <BackgroundImage src={Image} />
      <View className="flex-1">{step}</View>
    </>
  );
};

export default Forgot;
