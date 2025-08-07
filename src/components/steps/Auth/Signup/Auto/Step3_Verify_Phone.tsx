/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useBusinessVerifyPhoneSignUpMutation,
  useResendBusinessPhoneOtpMutation,
} from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Button from '@src/components/globals/Button';
import ButtonsGrid from '@src/components/globals/GridButtons';
import LoadingModal from '@src/components/globals/LoadingModal';
import OTP from '@src/components/globals/OTP';
import OTPTimer from '@src/components/globals/OTPTimer';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Step3_Verify_Phone = ({ back }: MultiStepFormProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const [input, updateInput] = useState<string>('');
  const { handleBusinessLogout } = useBusinessLogout();
  const [verifySignupPhone, { isLoading }] =
    useBusinessVerifyPhoneSignUpMutation();
  const [otpExpired, setOTPExpired] = useState(false);
  const [timerKey, setTimerKey] = useState(Date.now());
  const [resendBusinessPhoneOtp, { isLoading: resendOtpLoading }] =
    useResendBusinessPhoneOtpMutation();
  const handleVerifyOTP = useCallback(async (enteredOtp: string) => {
    try {
      const verifyOtpData = {
        otp: enteredOtp,
        otpTypes: 'verifyMobile',
      };
      const result = await verifySignupPhone(verifyOtpData).unwrap();
      if (result) {
        reset();
        renderToastSuccess(result.message);
        updateInput('');
        // if (next) next?.();
      }
    } catch (error: any) {
      updateInput('');
      renderToastError(error.data.message);
    }
  }, []);

  const handleOtpSubmit = useCallback((enteredOtp: string) => {
    setTimeout(() => {
      handleVerifyOTP(enteredOtp);
    }, 500);
  }, []);

  const reset = useCallback(() => {
    updateInput('');
  }, []);
  const handleResendOtp = async () => {
    try {
      const res = await resendBusinessPhoneOtp({
        phoneNumber: businessData?.phoneNumber,
      }).unwrap();
      setOTPExpired(false);
      setTimerKey(Date.now());
      renderToastSuccess(res?.message || 'Success');
    } catch (error: any) {
      renderToastError(error.data.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (!otpExpired) {
      const timer = setTimeout(() => setOTPExpired(true), 60000); // Set OTP expiration after 60 seconds
      return () => clearTimeout(timer); // Cleanup function
    }
  }, []);

  return (
    <ScreenAuth
      title="Verify Mobile"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      back={() => {
        handleBusinessLogout();
        // if (back) back?.();
      }}
    >
      <View style={globalStyle.mainTopCurvedCard}>
        <SignupStepsHeader
          colorStepOne={Colors.light.theme.signupStepDoneBackground}
          colorStepTwo={Colors.light.theme.signupStepInProgressBackground}
          colorStepThree={Colors.light.theme.singupStepRemainingBackgroud}
          titleStepOne="Terms & Policy"
          titleStepTwo="Details"
          titleStepThree="Verify ID"
          iconStepOne={<IconStepDone />}
          iconStepTwo={<IconStepInProgress />}
          iconStepThree={<IconStepRemaining />}
        />

        <Text
          style={{
            ...globalStyle.textRegular,
            marginTop: vs(18),
            marginLeft: hs(16),
            marginRight: hs(16),
          }}
        >
          We need to verify your mobile number, Please enter the sms code
          received below.
        </Text>

        <View className="justify-center items-center">
          <OTP
            inputTextColor={Colors.light.theme.black}
            code={input}
            width={95}
            editable={false}
            boxColor={Colors.light.theme.textInputBackgroundLight}
            onCodeFilled={() => {}}
          />
        </View>
        <View
          style={[
            globalStyle.keyboard,
            { backgroundColor: Colors.light.theme.white, marginTop: vs(10) },
          ]}
        >
          <ButtonsGrid
            maxInputLength={6}
            input={input}
            keyboardButtonsColor="black"
            onUpdate={updateInput}
            onBackspace={updateInput}
            onReset={reset}
            onMaxReached={code => {
              // next?.();
              handleOtpSubmit(code);
            }}
          />
        </View>

        {!otpExpired ? (
          <View style={{ alignSelf: 'center' }}>
            <OTPTimer
              key={timerKey}
              time={60}
              light
              text="Resend in "
              handleExpired={() => {
                setOTPExpired(true);
              }}
            />
          </View>
        ) : (
          <View style={{ marginTop: vs(6), width: '85%', alignSelf: 'center' }}>
            <Button
              btnTitle="Resend"
              onClick={() => handleResendOtp()}
              disabled={!otpExpired}
              loading={resendOtpLoading}
            />
          </View>
        )}
      </View>
      <LoadingModal isLoading={isLoading} />
    </ScreenAuth>
  );
};

export default Step3_Verify_Phone;
