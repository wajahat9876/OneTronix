/* eslint-disable camelcase */
import Button from '@src/components/globals/Button';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';
import { useState } from 'react';
import { View } from 'react-native';

const Step2_Debit_Card_Pin = ({ back }: MultiStepFormProps) => {
  const [input] = useState<string>('');

  return (
    <ScreenAuth
      title="Change Pin"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
      }}
      back={() => {
        if (back) back?.();
      }}
    >
      <View className="flex-1 mx-4 mt-4">
        <Text style={{ ...globalStyle.textMedium, fontSize: 20 }}>
          Card Pin Code
        </Text>
        <Text
          style={{ ...globalStyle.textRegular, fontSize: 14, marginTop: vs(8) }}
        >
          Your Card Pin Code is Below
        </Text>
        <View className="justify-center items-center mt-4">
          <OTP
            inputTextColor={Colors.light.theme.black}
            code={input}
            pinCount={4}
            width={70}
            editable={false}
            boxColor={Colors.light.theme.textInputBackgroundLight}
            onCodeFilled={() => {}}
          />
        </View>
        <View style={globalStyle.buttonContinue}>
          <Button btnTitle="Continue" onClick={() => {}} />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step2_Debit_Card_Pin;
