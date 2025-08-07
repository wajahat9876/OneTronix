/* eslint-disable camelcase */
import ButtonsGrid from '@src/components/globals/GridButtons';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { CardProps } from '../type';

const Step1_Current_Card_Pin = ({ next, parentGoto }: CardProps) => {
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
        parentGoto?.(0);
      }}
    >
      <View className="mx-4 mt-4">
        <Text style={{ ...globalStyle.textMedium, fontSize: 20 }}>
          Current Card Pin Code
        </Text>
        <Text
          style={{ ...globalStyle.textRegular, fontSize: 14, marginTop: vs(8) }}
        >
          Please enter your current Pin code to verify its you.
        </Text>

        <View className="items-center mt-4">
          <OTP
            inputTextColor={Colors.light.theme.black}
            code={input}
            pinCount={4}
            width={70}
            editable={false}
            secureTextEntry
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
            maxInputLength={4}
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

export default Step1_Current_Card_Pin;
