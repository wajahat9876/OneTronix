/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { useBusinessVerifySignInMutation } from "@/store/api/business/authApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import { useConfig } from "@/store/selectors/config/config";
import ButtonsGrid from "@src/components/globals/GridButtons";
import LoadingModal from "@src/components/globals/LoadingModal";
import OTP from "@src/components/globals/OTP";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { StyleSheet, Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { globalStyle } from "@src/styles/globals";
import { hs, vs } from "@utils/design/design";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Animated from "react-native-reanimated";

const Step2_OTP = ({ back }: MultiStepFormProps) => {
  const dispatch = useAppDispatch();
  const { signInBusinessEmail } = useAppSelector(useBusinessDetails);
  const [verifyBusinessSignIn, { isLoading: businessLoading }] =
    useBusinessVerifySignInMutation();
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [otpExpired, setOTPExpired] = useState(false);
  const { deviceModal, deviceId, deviceType, pushToken } =
    useAppSelector(useConfig);

  const handleBusinessVerifyOTP = useCallback(async (enteredOtp: string) => {
    try {
      const verifySignInData = {
        // otp: Number(enteredOtp),
        otp: enteredOtp,
        notificationToken: pushToken,
        deviceOS: Platform.OS,
        deviceModal,
        deviceId,
        deviceType,
        email: signInBusinessEmail,
        otpTypes: "SignIn",
      };
      const result = await verifyBusinessSignIn(verifySignInData).unwrap();
      // if (result) {
      //   if (result?.data?.isVerified && !result?.data?.mainApplicantAddress) {
      //     router.replace('/(auth)/UpdatedAddress');
      //   } else if (
      //     result?.data?.isVerified &&
      //     result?.data?.mainApplicantAddress &&
      //     !result?.data?.isPinSet
      //   ) {
      //     router.replace('/(auth)/ChoosePin/Business');
      //   } else if (
      //     result?.data?.isVerified &&
      //     result?.data?.mainApplicantAddress &&
      //     result?.data?.isPinSet
      //   ) {
      //     dispatch(setIsPinCodeAccepted(true));
      //     router.replace('/(main)/Business/Home');
      //   } else {
      //     router.replace('/(auth)/Signup/Business');
      //   }
      router.replace("/(main)/Business/Home");
      renderToastSuccess(result.message);
      setInput("");
    } catch (error: any) {
      renderToastError(error.data.message);
      setInput("");
    }
  }, []);

  const handleCodeSubmit = useCallback((enteredOtp: string) => {
    setTimeout(() => {
      handleBusinessVerifyOTP(enteredOtp);
    }, 500);
  }, []);

  // const handleResendBusinessOtp = async () => {
  //   try {
  //     const res = await resendBusinessOtp({
  //       email: signInBusinessEmail,
  //     }).unwrap();
  //     setOTPExpired(false);
  //     setTimerKey(Date.now());
  //     renderToastSuccess(res?.message || 'Success');
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message || 'Something Went wrong');
  //   }
  // };
  // const handleResendOtpSubmit = useCallback(() => {
  //   setTimeout(() => {
  //     handleResendBusinessOtp();
  //   }, 500);
  // }, []);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!otpExpired) {
      const timer = setTimeout(() => setOTPExpired(true), 60000); // Set OTP expiration after 60 seconds
      return () => clearTimeout(timer); // Cleanup function
    }
  }, []);
  const reset = useCallback(() => {
    setInput("");
  }, []);

  return (
    <ScreenAuth
      title="Verify Sign In"
      topColor="transparent"
      bottomColor="transparent"
      disableTopSafeArea
      disableBottomSafeArea
      darkStatus={false}
      appBarProps={{
        light: false,
        rightIcon: false,
      }}
      back={() => {
        if (back) back?.();
      }}
    >
      <View style={styles.container}>
        <Text
          style={styles.title}
          className="text-white ml-4 font-poppins-medium"
        >
          Verify OTP
        </Text>
        <Text
          style={styles.subtitle}
          className="text-[#D6D6D6] ml-4 font-poppins-medium"
        >
          We have sent you an OTP on your email, please enter it here to verify
          your sign in
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
            onMaxReached={(otp) => {
              handleCodeSubmit(otp);
            }}
          />
        </View>
        {/* {!otpExpired ? (
          <View style={{ alignSelf: 'center' }}>
            <OTPTimer
              key={timerKey}
              time={60}
              light={false}
              text="Resend in "
              handleExpired={() => {
                setOTPExpired(true);
              }}
            />
          </View>
        ) : (
          <View
            style={{ marginTop: vs(10), width: '85%', alignSelf: 'center' }}
          >
            <Button
              btnTitle="Resend"
              btnColor="rgba(128, 128, 128, 0.5)"
              btnTitleColor="white"
              onClick={handleResendOtpSubmit}
              disabled={!otpExpired}
              loading={resendBusinessLoading}
            />
          </View>
        )} */}
      </View>
      <LoadingModal isLoading={businessLoading} />
    </ScreenAuth>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: vs(32),
    paddingHorizontal: hs(8),
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    marginTop: vs(16),
    fontSize: 14,
  },
});
export default Step2_OTP;
