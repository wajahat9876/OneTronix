/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import OTP from "@src/components/globals/OTP";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { StyleSheet, Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { globalStyle } from "@src/styles/globals";
import { hs, vs } from "@utils/design/design";
import { useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

const Step3_OTP_Verification = ({ goTo }: MultiStepFormProps) => {
  const [input, setInput] = useState<string>("");

  return (
    <ScreenAuth
      title="Pay & Transfer"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        goTo?.(0);
      }}
    >
      <View style={globalStyle.mainTopCurvedCard}>
        <Text
          style={styles.title}
          className="text-gray-800  ml-4 font-poppins-medium"
        >
          Verify OTP
        </Text>
        <Text
          style={{
            ...globalStyle.textRegular,
            marginTop: vs(20),
            marginLeft: hs(16),
            marginRight: hs(16),
          }}
        >
          Please enter 6 digit OTP sent to your registered email address
        </Text>
        <Animated.View className="justify-center items-center">
          <OTP
            inputTextColor={Colors.light.theme.black}
            code={input}
            width={90}
            editable={false}
            boxColor={Colors.light.theme.textInputBackgroundLight}
            onCodeFilled={() => {}}
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
export default Step3_OTP_Verification;
