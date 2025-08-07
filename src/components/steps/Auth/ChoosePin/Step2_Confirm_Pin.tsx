/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable camelcase */
// eslint-disable-next-line import/order

import { useSetBusinessPinMutation } from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import { setIsPinCodeAccepted } from '@/store/slices/common/signInTypeSlice';
import ButtonsGrid from '@src/components/globals/GridButtons';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppDispatch, useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { kycStyles } from '@src/styles/KYC';
import { vs } from '@utils/design/design';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

const Step2_Confirm_Pin = ({ back }: MultiStepFormProps) => {
  const [input, updateInput] = useState<string>('');
  const [updateBusinessPassCode] = useSetBusinessPinMutation();
  const { businessReduxPassCode } = useAppSelector(useBusinessDetails);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const reset = useCallback(() => {
    updateInput('');
    setHasSubmitted(false);
  }, []);
  const dispatch = useAppDispatch();
  const handleSubmit = async (pinCode: string) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    try {
      const res = await updateBusinessPassCode({
        pin: businessReduxPassCode,
        confirmPin: pinCode,
      }).unwrap();
      renderToastSuccess(res?.message || 'Confirm Successfully');
      dispatch(setIsPinCodeAccepted(true));
      updateInput('');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'PassCode Confirm Failed');
      setHasSubmitted(false);
      updateInput('');
    }
  };
  useEffect(() => {
    if (input.length === 4 && !hasSubmitted) {
      handleSubmit(input);
    }
  }, [input, hasSubmitted]);
  return (
    <ScreenAuth
      title="Pin Code"
      style={{
        backgroundColor: 'transparent',
      }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        if (back) back?.();
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <Text style={kycStyles.heading}>Confirm Pin Code</Text>
        <Text style={kycStyles.subHeading}>
          Please confirm your chosen 4-digit PIN for account security.
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
            // onMaxReached={pin => {
            //   handleSubmit(pin);
            // }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step2_Confirm_Pin;
