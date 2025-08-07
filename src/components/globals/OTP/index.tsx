/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import Colors from '@src/constants/Colors';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { hs, ms, vs } from '@utils/design/design';
import React, { useEffect } from 'react';

const OTP = (props: any) => {
  const {
    inputTextColor,
    pinCount,
    code,
    onCodeFilled,
    boxColor,
    width,
    editable,
    secureTextEntry,
  } = props;

  const [otpCode, setOtpCode] = React.useState<string | null>();

  useEffect(() => {
    if (otpCode && otpCode.length === 6) {
      if (onCodeFilled) onCodeFilled(otpCode);
    }
  }, [otpCode]);

  // const listenOTP = (message: any) => {
  //   debug('message', message);
  //   const otpnew = /(\d{6})/g.exec(message)?.[0];
  //   setOtpCode(otpnew);
  // };

  useEffect(() => {
    // if (Platform.OS === 'android') {
    //   getHash()
    //     .then((hash1: string[]) => {
    //       // use this hash in the message.
    //       debug('hash', hash1);
    //     })
    //     .catch(debug);

    //   getOtp()
    //     .then(() => addListener(listenOTP))
    //     .catch(debug);
    // }
    return () => {
      setOtpCode(null);
      // removeListener();
    };
  }, []);

  return (
    <OTPInputView
      {...props}
      pinCount={pinCount || 6}
      style={{
        height: vs(100),
        width: `${width}%` || '90%',
      }}
      code={otpCode || code}
      onCodeFilled={onCodeFilled}
      editable={editable}
      autoFocusOnLoad={false}
      secureTextEntry={secureTextEntry}
      selectionColor="white"
      codeInputFieldStyle={{
        borderWidth: 0,
        borderRadius: ms(10),
        color: inputTextColor || Colors.light.theme.white,
        fontSize: ms(30),
        fontFamily: 'poppins',
        height: vs(55),
        width: hs(50),
        backgroundColor: boxColor || Colors.light.theme.darkYellow,
      }}
    />
  );
};

export default OTP;
