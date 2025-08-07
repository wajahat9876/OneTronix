/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useVerifyForgotBusinessPasswordEmailMutation,
  useVerifyForgotBusinessPasswordPhoneMutation,
} from '@/store/api/business/authApis';
import Button from '@src/components/globals/Button';
import ButtonsGrid from '@src/components/globals/GridButtons';
import LoadingModal from '@src/components/globals/LoadingModal';
import OTP from '@src/components/globals/OTP';
import OTPTimer from '@src/components/globals/OTPTimer';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm/types';
import { renderToastError } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

interface Step2_Probs extends MultiStepFormProps {
  setCheckData: (data: any) => void;
  checkData: any;
}
const Step2_OTPEmail = ({
  next,
  back,
  checkData,
  setCheckData,
}: Step2_Probs) => {
  const [verifForgotBusinessPasswordEmail, { isLoading: emailLoading }] =
    useVerifyForgotBusinessPasswordEmailMutation();
  const [verifForgotBusinessPasswordPhone, { isLoading: phoneLoading }] =
    useVerifyForgotBusinessPasswordPhoneMutation();
  const [input, setInput] = useState<string>('');
  const [otpExpired, setOTPExpired] = useState(false);
  const [timerKey, setTimerKey] = useState(Date.now());
  const handleBusinessVerifyOTP = useCallback(async (enteredOtp: string) => {
    if (checkData?.isphone === true) {
      try {
        const verifyForogtData = {
          otp: enteredOtp,
          type: 'forgetPasswordNumber',
          phoneNumber: checkData?.phone,
        };
        await verifForgotBusinessPasswordPhone(verifyForogtData).unwrap();
        if (next) next();
      } catch (error: any) {
        setInput('');
        renderToastError(error.data.message);
      }
    }
    if (checkData?.isphone === false) {
      try {
        const verifyForogtData = {
          otp: enteredOtp,
          type: 'forgetPasswordEmail',
          email: checkData?.email,
        };
        await verifForgotBusinessPasswordEmail(verifyForogtData).unwrap();
        if (next) next();
      } catch (error: any) {
        setInput('');
        renderToastError(error.data.message);
      }
    }
  }, []);
  const handleCodeSubmit = useCallback((enteredOtp: string) => {
    setTimeout(() => {
      handleBusinessVerifyOTP(enteredOtp);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!otpExpired) {
      const timer = setTimeout(() => setOTPExpired(true), 60000);
      return () => clearTimeout(timer);
    }
  }, []);
  const reset = useCallback(() => {
    setInput('');
  }, []);
  return (
    <ScreenAuth
      title="Verify OTP"
      topColor="transparent"
      bottomColor="transparent"
      darkStatus={false}
      appBarProps={{
        light: false,
        rightIcon: false,
      }}
      back={() => {
        if (back) {
          setCheckData({
            isphone: false,
            phone: '',
            email: '',
          });
          back?.();
        }
      }}
    >
      <View className="px-2">
        <Text
          style={styles.title}
          className="text-white ml-4 font-poppins-medium"
        >
          {checkData?.isphone ? 'Check your Phone' : 'Check your Email'}
        </Text>
        <Text
          style={styles.subtitle}
          className="text-[#D6D6D6] ml-4 font-poppins-medium"
        >
          {checkData?.isphone
            ? `We sent OTP to ${checkData?.phone}. Enter the 6 digit code that is mentioned there`
            : `We sent OTP to ${checkData?.email}. Enter the 6 digit code that is mentioned there`}
        </Text>
        <Animated.View className="justify-center items-center">
          <OTP
            inputTextColor={Colors.light.theme.white}
            code={input}
            width={90}
            editable={false}
            boxColor={Colors.light.theme.textInputBackgroundDark}
            onCodeFilled={() => {}}
          />
        </Animated.View>
        <View
          style={[
            globalStyle.keyboard,
            { backgroundColor: Colors.light.theme.textInputBackgroundDark },
          ]}
        >
          <ButtonsGrid
            keyboardButtonsColor="white"
            maxInputLength={6}
            input={input}
            onUpdate={setInput}
            onBackspace={setInput}
            onReset={reset}
            onMaxReached={otp => {
              handleCodeSubmit(otp);
            }}
          />
        </View>
        {!otpExpired ? (
          <View style={{ marginTop: vs(30), alignSelf: 'center' }}>
            <OTPTimer
              key={timerKey}
              time={30}
              light={false}
              text="Try Again in "
              handleExpired={() => {
                setOTPExpired(true);
              }}
            />
          </View>
        ) : (
          <View
            style={{ marginTop: vs(30), width: '85%', alignSelf: 'center' }}
          >
            <Button
              btnTitle="Try Again"
              onClick={() => back?.()}
              btnColor="rgba(128, 128, 128, 0.5)"
              disabled={!otpExpired}
            />
          </View>
        )}
      </View>
      <LoadingModal isLoading={emailLoading || phoneLoading} />
    </ScreenAuth>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: vs(5),
    fontSize: 20,
  },
  subtitle: {
    marginTop: vs(16),
    fontSize: 14,
  },
});
export default Step2_OTPEmail;
