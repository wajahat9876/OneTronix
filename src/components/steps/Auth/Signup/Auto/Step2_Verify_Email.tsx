/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useBusinessVerifyEmailSignUpMutation,
  useResendBusinessEmailOtpMutation,
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
const Step2_Verify_Email = ({ back }: MultiStepFormProps) => {
  const { businessEmail } = useAppSelector(useBusinessDetails);
  const [input, updateInput] = useState<string>('');
  const { handleBusinessLogout } = useBusinessLogout();
  const [verifySignupEmail, { isLoading }] =
    useBusinessVerifyEmailSignUpMutation();
  const [resendbusinessEmailOtp, { isLoading: businessResendLoading }] =
    useResendBusinessEmailOtpMutation();
  const [otpExpired, setOTPExpired] = useState(false);
  const [timerKey, setTimerKey] = useState(Date.now());
  const handleVerifyOTP = useCallback(async (enteredOtp: string) => {
    try {
      const verifyOtpData = {
        otp: enteredOtp,
        otpTypes: 'verifyEmail',
      };
      const result = await verifySignupEmail(verifyOtpData).unwrap();
      if (result) {
        renderToastSuccess(result.message);
        updateInput('');
        // if (next) next?.();
      }
    } catch (error: any) {
      reset();
      renderToastError(error.data.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleOtpSubmit = useCallback((enteredOtp: string) => {
    setTimeout(() => {
      handleVerifyOTP(enteredOtp);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const reset = useCallback(() => {
    updateInput('');
  }, []);
  const handleResendEmailOtp = async () => {
    try {
      const res = await resendbusinessEmailOtp({
        email: businessEmail,
      }).unwrap();
      setOTPExpired(false);
      setTimerKey(Date.now());
      renderToastSuccess(res?.message || 'Success');
    } catch (error: any) {
      renderToastError(error.data.message || 'Something went wrong');
    }
  };
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!otpExpired) {
      const timer = setTimeout(() => setOTPExpired(true), 60000); // Set OTP expiration after 60 seconds
      return () => clearTimeout(timer); // Cleanup function
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ScreenAuth
      title="Verify Email"
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
            marginTop: vs(25),
            marginLeft: hs(16),
            marginRight: hs(16),
          }}
        >
          We need to verify your email address, Please enter the sms code
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
            { backgroundColor: Colors.light.theme.white, marginTop: vs(32) },
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
              onClick={() => handleResendEmailOtp()}
              disabled={!otpExpired}
              loading={businessResendLoading}
            />
          </View>
        )}
      </View>
      <LoadingModal isLoading={isLoading} />
    </ScreenAuth>
  );
};

export default Step2_Verify_Email;
