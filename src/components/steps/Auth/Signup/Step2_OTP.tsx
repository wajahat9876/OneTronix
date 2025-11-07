/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useVerifyOtpInstallerMutation,
  useVerifyOtpMutation,
} from "@/store/api/business/authApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import { useConfig } from "@/store/selectors/config/config";
import { businessLogout } from "@/store/slices/business/businessSlice";
import Logo from "@assets/eccLogo/oneTronixLogo.svg";
import LoadingModal from "@src/components/globals/LoadingModal";
import OTP from "@src/components/globals/OTP";
import { StyleSheet, Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
const Step2_OTP = ({ back }: MultiStepFormProps) => {
  const dispatch = useAppDispatch();
  const { signInBusinessEmail, role } = useAppSelector(useBusinessDetails);
  const [verifyBusinessSignIn, { isLoading: businessLoading }] =
    useVerifyOtpMutation();
  const [verifyInstallerOtp, { isLoading: installerLoading }] =
    useVerifyOtpInstallerMutation();
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [otpExpired, setOTPExpired] = useState(false);
  const { deviceModal, deviceId, deviceType, pushToken } =
    useAppSelector(useConfig);

  const handleBusinessVerifyOTP = useCallback(async (enteredOtp: string) => {
    try {
      const verifySignInData = {
        // otp: Number(enteredOtp),
        otp: Number(enteredOtp),
        otpType: "verifyEmail",

        // notificationToken: pushToken,
        // deviceOS: Platform.OS,
        // deviceModal,
        // deviceId,
        // deviceType,
        // email: signInBusinessEmail,
      };
      if (role) {
        const result = await verifyInstallerOtp(verifySignInData).unwrap();
        router.replace("/(auth)/Welcome");
        renderToastSuccess(result.message);
      } else {
        const result = await verifyBusinessSignIn(verifySignInData).unwrap();
        renderToastSuccess(result.message);
        router.replace("/(main)/Business/Home");
      }

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

  const handleBack = () => {
    dispatch(businessLogout());
    router.replace("/(auth)/Signin");
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: hs(10),
          paddingVertical: hs(30),
          marginTop: Platform.OS === "ios" ? vs(10) : vs(15),
        }}
      >
        <TouchableOpacity onPress={() => handleBack()}>
          <Text
            style={{
              color: "white",
              fontSize: ms(16),
              marginTop: vs(10),
              fontFamily: "Ranade-Regular",
            }}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignSelf: "flex-end",
          }}
        >
          <Logo />
        </View>
      </View>
      <View
        style={{
          // alignItems: "flex-start",
          marginLeft: 12,
          marginTop: vs(8),
        }}
      >
        <Text
          style={{
            color: "red",
            fontWeight: "900",
            fontSize: ms(44),
            fontFamily: "Excon-Black",
            lineHeight: 45,
          }}
        >
          ONE
        </Text>
        <Text
          style={{
            color: "red",
            fontSize: ms(44),
            fontFamily: "Excon-Regular",
            lineHeight: 45,
            marginTop: -4, // tighten spacing between ONE and TRONIX
          }}
        >
          TRONIX
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: ms(13),
            fontFamily: "Excon-Regular",
            letterSpacing: 1,
            lineHeight: 18,
            marginTop: -5, // small gap from TRONIX
          }}
        >
          TECHNOLOGY PARTNER
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title} className="text-white  ">
          Verify OTP
        </Text>
        <Text style={styles.subtitle} className="text-[#D6D6D6]  ">
          Enter the verification code we sent on your email
        </Text>
        <Animated.View className="justify-center items-center">
          <OTP
            inputTextColor={Colors.light.theme.white}
            code={input}
            onChange={(text: string) => {
              setInput(text);
            }}
            width={90}
            // editable={false}
            boxColor={Colors.light.theme.textInputBackgroundDark}
            onCodeFilled={handleCodeSubmit}
          />
        </Animated.View>

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
      <LoadingModal isLoading={businessLoading || installerLoading} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: vs(60),
    paddingHorizontal: hs(8),
  },
  title: {
    fontSize: ms(24),
    fontFamily: "Excon-Medium",
    alignSelf: "center",
  },
  subtitle: {
    marginTop: vs(16),
    fontSize: ms(12),
    fontFamily: "Ranade-Thin",
    alignSelf: "center",
    width: "60%",
  },
});
export default Step2_OTP;
