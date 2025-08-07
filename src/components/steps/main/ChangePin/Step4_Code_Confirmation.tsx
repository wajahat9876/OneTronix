/* eslint-disable camelcase */
import ButtonsGrid from '@src/components/globals/GridButtons';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

const Step4_Code_Confirmation = ({ next, back }: MultiStepFormProps) => {
  const [input, updateInput] = useState<string>('');

  const reset = useCallback(() => {
    updateInput('');
  }, []);
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
      <View className="mx-4 mt-4">
        <Text style={{ ...globalStyle.textMedium, fontSize: 20 }}>
          Code Confirmation
        </Text>
        <Text
          style={{ ...globalStyle.textRegular, fontSize: 14, marginTop: vs(8) }}
        >
          We need to verify So enter the code sent via SMS below.{' '}
        </Text>

        <View className="items-center mt-4">
          <OTP
            inputTextColor={Colors.light.theme.black}
            code={input}
            width={100}
            editable={false}
            boxColor={Colors.light.theme.textInputBackgroundLight}
            onCodeFilled={() => {}}
          />
        </View>
        <View
          style={[
            globalStyle.keyboard,
            {
              backgroundColor: Colors.light.theme.white,
              height: '55%',
              marginLeft: 0,
              marginRight: 0,
            },
          ]}
        >
          <ButtonsGrid
            keyboardButtonsColor={Colors.light.theme.black}
            maxInputLength={6}
            input={input}
            onUpdate={updateInput}
            onBackspace={updateInput}
            onReset={reset}
            onMaxReached={() => {
              if (next) next?.();
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step4_Code_Confirmation;
