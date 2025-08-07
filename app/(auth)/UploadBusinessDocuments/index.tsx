/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Step0_Upload_Business_Information from '@src/components/steps/Auth/UploadDocuments/Step0_Upload_Business_Information';
import Step1_Upload_Business_Address_Proof from '@src/components/steps/Auth/UploadDocuments/Step1_Upload_Business_Address_Proof';
import Step2_Upload_ShareHolder_Documents from '@src/components/steps/Auth/UploadDocuments/Step2_Upload_ShareHolder_Documents';
import Step3_Important_Notice from '@src/components/steps/Auth/UploadDocuments/Step3_Important_Notice';
import Step4_Account_Created_Successfully from '@src/components/steps/Auth/UploadDocuments/Step4_Account_Created_Successfully';
import { pageTransitionAnimation } from '@src/constants/Animation';
import useMultistepForm from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const UploadBusinessDocuments = () => {
  const router = useRouter();
  const { data: businessData, auth_token } = useAppSelector(useBusinessDetails);
  const { data: businessCurrentData } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const [showScreen, setShowScreen] = useState(false);
  const { step, goTo } = useMultistepForm(
    [
      <Step0_Upload_Business_Information />, // 0
      <Step1_Upload_Business_Address_Proof />, // 1
      <Step2_Upload_ShareHolder_Documents />, // 2
      <Step3_Important_Notice />, // 3
      <Step4_Account_Created_Successfully />, // 4
    ],
    {
      newHook: true,
      animatedViewProps: {
        ...pageTransitionAnimation,
      },
    },
  );
  useEffect(() => {
    if (businessData && goTo) {
      if (!auth_token) {
        router.replace('/(auth)/Welcome');
      }
      if (auth_token && !businessData?.checkBusinessInfo) {
        goTo(0);
      }
      // const hasActiveAccount = businessData?.accountDetails?.some(
      //   account => account?.active && account?.approved === true,
      // );
      if (businessData?.checkBusinessInfo && !businessData?.docsUpload1) {
        goTo(1);
      }
      if (businessData?.docsUpload1 && !businessData?.docsUpload2) {
        goTo(2);
      }
      if (businessData?.docsUpload2 && !businessData?.checkImportantInfo) {
        goTo(3);
      }

      if (businessData?.checkImportantInfo) {
        goTo(4);
      }
      if (businessData?.isVerified && businessData?.mainApplicantAddress) {
        // router.replace('/(main)/Business/Home/');
        router.replace('/(auth)/ChoosePin/Business');
      }
      if (businessData?.isVerified && !businessData?.mainApplicantAddress) {
        router.replace('/(auth)/UpdatedAddress');
      }
      // if (businessData?.isVerified && hasActiveAccount) {
      //   router.replace('/(auth)/ChoosePin/Business/');
      // }
    }
    setShowScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData, businessCurrentData]);
  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      {showScreen && <View className="flex-1">{step}</View>}
    </>
  );
};

export default UploadBusinessDocuments;
