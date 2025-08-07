/* eslint-disable import/order */
/* eslint-disable camelcase */
import { setBusinessPassCode } from '@/store/slices/business/businessSlice';
import ButtonsGrid from '@src/components/globals/GridButtons';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppDispatch } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { kycStyles } from '@src/styles/KYC';
import { vs } from '@utils/design/design';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

const Step1_Choose_Pin = ({ next }: MultiStepFormProps) => {
  const [input, updateInput] = useState<string>('');
  const { handleBusinessLogout } = useBusinessLogout();
  const dispatch = useAppDispatch();
  const handleSubmit = (pin: string) => {
    dispatch(setBusinessPassCode(pin));
    if (next) {
      next();
    }
  };
  const reset = useCallback(() => {
    updateInput('');
  }, []);
  return (
    <ScreenAuth
      title="Pin Code"
      style={{
        backgroundColor: 'transparent',
      }}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      back={() => {
        handleBusinessLogout();
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <Text style={kycStyles.heading}>Choose Pin Code</Text>
        <Text style={kycStyles.subHeading}>
          Please select a 4-digit PIN for your account security.
        </Text>
        <View className="justify-center items-center mt-4">
          <OTP
            inputTextColor={Colors.light.theme.black}
            pinCount={4}
            code={input}
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
            { backgroundColor: Colors.light.theme.white, marginTop: vs(56) },
          ]}
        >
          <ButtonsGrid
            maxInputLength={4}
            input={input}
            keyboardButtonsColor="black"
            onUpdate={updateInput}
            onBackspace={updateInput}
            onReset={reset}
            onMaxReached={pin => {
              handleSubmit(pin);
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step1_Choose_Pin;
