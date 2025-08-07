/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */

import Step0_Payee from '@src/components/steps/main/Business/AddNewPayee/Step0_Payee';
import Step1_Payee_Details from '@src/components/steps/main/Business/AddNewPayee/Step1_Payee_Details';
import Step2_Payment_Summary from '@src/components/steps/main/Business/AddNewPayee/Step2_Payment_Summary';
import Step3_OTP_Verification from '@src/components/steps/main/Business/AddNewPayee/Step3_OTP_Verification';
import Step4_Payment_Succes from '@src/components/steps/main/Business/AddNewPayee/Step4_Payment_Succes';
import Step5_Payment_Schedule from '@src/components/steps/main/Business/AddNewPayee/Step5_Payment_Schedule';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Delete_Payee from './DeletePayee';

const TransferMoney = ({ navigation }: any) => {
  const { step, goTo } = useMultistepForm(
    [
      <Step0_Payee />, // 0
      <Step1_Payee_Details />, // 1
      <Step2_Payment_Summary />, // 2
      <Step3_OTP_Verification />, // 3
      <Step4_Payment_Succes />, // 4
      <Step5_Payment_Schedule />, // 5
      <Delete_Payee />, // 6
    ],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );
  const doublePressRef = useRef(false);
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    const handleTabPress = () => {
      if (doublePressRef?.current) {
        if (goTo) goTo(0);
        doublePressRef.current = false;
      } else {
        doublePressRef.current = true;
        timer = setTimeout(() => {
          doublePressRef.current = false;
        }, 300);
      }
    };

    const unsubscribe = navigation.addListener('tabPress', handleTabPress);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [goTo, navigation]);
  return <View className="flex-1">{step}</View>;
};

export default TransferMoney;
