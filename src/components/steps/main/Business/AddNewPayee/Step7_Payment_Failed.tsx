/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable camelcase */
import RedCross from '@assets/icons/redCross.png';
import EasyEmoneyGradient from '@src/components/globals/BackgroundGradient';
import Button from '@src/components/globals/Button';
import { SafeAreaView, StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { kycStyles } from '@src/styles/KYC';
import { hs, vs } from '@utils/design/design';
import React from 'react';
import { Image, View } from 'react-native';

const Step7_Payment_Failed = ({ goTo }: MultiStepFormProps) => {
  return (
    <>
      <EasyEmoneyGradient />
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            ...kycStyles.heading,
            marginTop: vs(100),
            marginLeft: hs(0),
            color: Colors.light.theme.white,
          }}
        >
          Payment Failed
        </Text>
        <View style={styles.checkIcon}>
          <Image source={RedCross} style={{ width: 100, height: 100 }} />
        </View>

        <Text style={styles.title}>{`Payment Transfer\n Failed`}</Text>

        <View style={{ ...kycStyles.button, bottom: vs(100) }}>
          <Button
            btnTitle="Try Again"
            onClick={() => {
              goTo?.(0);
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkIcon: {
    marginTop: vs(56),
  },
  title: {
    color: 'white',
    fontFamily: 'poppins-semibold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: vs(32),
    marginLeft: hs(8),
    marginRight: hs(8),
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.theme.white,
    textAlign: 'center',
    marginTop: vs(32),
  },
});
export default Step7_Payment_Failed;
