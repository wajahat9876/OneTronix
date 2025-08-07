/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useLazyGetMultiPayeeQuery,
  useLazyGetPayeeQuery,
  useTransferAmountMutation,
  useTransferInternalPaymentMutation,
  useTransferOutboundPaymentMutation,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import { resetBeneficiaryDetails } from '@/store/slices/business/businessSlice';
import ButtonsGrid from '@src/components/globals/GridButtons';
import LoadingModal from '@src/components/globals/LoadingModal';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm/types';
import { useAppDispatch, useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const Step3_OTP_Verification = ({ goTo }: MultiStepFormProps) => {
  const [transferAmount, { isLoading }] = useTransferAmountMutation();
  const [transferInternal, { isLoading: internalLoading }] =
    useTransferInternalPaymentMutation();
  const [transferOutbound, { isLoading: externalLoading }] =
    useTransferOutboundPaymentMutation();
  const [input, setInput] = useState<string>('');
  const [otpExpired, setOTPExpired] = useState(false);
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [timerKey, setTimerKey] = useState(Date.now());
  // const [resendBusinessOtp, { isLoading: resendBusinessLoading }] =
  //   useResendBusinessSigninOtpMutation();
  const {
    beneficiaryDetails,
    data: businessData,
    isInternal,
  } = useAppSelector(useBusinessDetails);
  const [trigger] = useLazyGetPayeeQuery();
  const [multiTrigger] = useLazyGetMultiPayeeQuery();
  const handleBusinessVerifyOTP = useCallback(async (enteredOtp: string) => {
    try {
      const updatedData = {
        sortCode: beneficiaryDetails?.sortCode,
        accountNo: beneficiaryDetails?.accountNo,
        creditorName: beneficiaryDetails?.creditorName,
        Amount: beneficiaryDetails?.Amount,
        reference: beneficiaryDetails?.reference,
        otp: enteredOtp,
        otpTypes: 'transcationOtp',
      };
      const result = await transferAmount(updatedData).unwrap();
      if (result) {
        renderToastSuccess(result.message);
        await trigger({}).unwrap();
        dispatch(resetBeneficiaryDetails());
        setInput('');
        goTo?.(4);
      }
    } catch (error: any) {
      renderToastError(error.data.message);
      setInput('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleMultiInternalVerifyOtp = useCallback(
    async (enteredOtp: string) => {
      try {
        const updatedData = {
          creditAccountIban: beneficiaryDetails?.iban,
          payeeName: beneficiaryDetails?.payeeName,
          amount: beneficiaryDetails?.Amount,
          reference: beneficiaryDetails?.reference,
          otp: Number(enteredOtp),
          otpTypes: 'transcationOtp',
        };
        const result = await transferInternal(updatedData).unwrap();
        if (result) {
          renderToastSuccess(result.message);
          await multiTrigger({}).unwrap();
          dispatch(resetBeneficiaryDetails());
          setInput('');
          goTo?.(4);
        }
      } catch (error: any) {
        renderToastError(error.data.message);
        setInput('');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );
  const handleMultiOutboundVerifyOtp = useCallback(
    async (enteredOtp: string) => {
      try {
        const updatedData = {
          amount: beneficiaryDetails?.Amount,
          reference: beneficiaryDetails?.reference,
          creditor: {
            name: beneficiaryDetails?.name,
            address: {
              addressLine1: beneficiaryDetails?.addressLine1,
              addressLine2: beneficiaryDetails?.addressLine2,
              postCode: beneficiaryDetails?.postCode,
              country: beneficiaryDetails?.country,
              ...(beneficiaryDetails?.addressLine3 && {
                addressLine3: beneficiaryDetails?.addressLine3,
              }),
            },
            ...(beneficiaryDetails?.iban && { iban: beneficiaryDetails?.iban }),
            ...(beneficiaryDetails?.accountNumber && {
              accountNumber: beneficiaryDetails?.accountNumber,
            }),
          },
          creditorAgent: {
            financialInstitutionIdentification: {
              bic: beneficiaryDetails?.bic,
              name: beneficiaryDetails?.agentName,
              addressDetails: {
                country: beneficiaryDetails?.agentCountry,
              },
            },
          },
          otp: Number(enteredOtp),
          otpTypes: 'transcationOtp',
        };
        const result = await transferOutbound(updatedData).unwrap();
        if (result) {
          renderToastSuccess(result.message);
          await multiTrigger({}).unwrap();
          dispatch(resetBeneficiaryDetails());
          setInput('');
          if (result?.data?.results?.isScheduled) {
            goTo?.(5);
          } else {
            goTo?.(4);
          }
        }
      } catch (error: any) {
        renderToastError(error.data.message);
        setInput('');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );
  const handleCodeSubmit = useCallback((enteredOtp: string) => {
    setTimeout(() => {
      if (businessData?.activeCurrency === 1) {
        handleBusinessVerifyOTP(enteredOtp);
      } else if (businessData?.activeCurrency !== 1 && isInternal) {
        handleMultiInternalVerifyOtp(enteredOtp);
      } else {
        handleMultiOutboundVerifyOtp(enteredOtp);
      }
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
    setInput('');
  }, []);

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
        <View
          style={[
            globalStyle.keyboard,
            { backgroundColor: Colors.light.theme.white, marginTop: vs(22) },
          ]}
        >
          <ButtonsGrid
            keyboardButtonsColor="black"
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
      <LoadingModal
        isLoading={isLoading || internalLoading || externalLoading}
      />
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
