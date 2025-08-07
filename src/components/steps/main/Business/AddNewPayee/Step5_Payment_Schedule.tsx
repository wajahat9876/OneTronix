/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import ProcessingIcon from '@assets/icons/ProcessingIcon.svg';
import Image from '@assets/images/BackgroundImage/Background.png';
import BackgroundImage from '@src/components/globals/BackgroundImage';
import Button from '@src/components/globals/Button';
import { SafeAreaView, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { kycStyles } from '@src/styles/KYC';
import { hs, vs } from '@utils/design/design';
import React from 'react';
import { View } from 'react-native';

const Step5_Payment_Schedule = ({ goTo }: MultiStepFormProps) => {
  return (
    <>
      <BackgroundImage src={Image} />
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
      >
        <Text
          style={{
            ...kycStyles.heading,
            marginTop: vs(40),
            marginLeft: hs(0),
            color: Colors.light.theme.white,
          }}
        />
        <View className="items-center mt-10 flex-1">
          <ProcessingIcon />
          <Text
            style={{
              ...globalStyle.textSemibold,
              fontSize: 18,
              marginTop: vs(24),
              marginLeft: hs(16),
              marginRight: hs(16),
              textAlign: 'center',
              color: 'white',
            }}
          >
            Your transaction has been scheduled{'\n'}and will be processed
            between 8:20 AM to 8:30 AM.
          </Text>
          <View style={{ ...globalStyle.buttonContinue, bottom: vs(26) }}>
            <Button
              btnTitle="Done"
              onClick={() => {
                goTo?.(0);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Step5_Payment_Schedule;
