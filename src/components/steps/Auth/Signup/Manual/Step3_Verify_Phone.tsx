/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useBusinessVerifyPhoneSignUpMutation,
  useResendBusinessPhoneOtpMutation,
  useUpdateBusinessPhoneNumberMutation,
} from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '@src/components/globals/Button';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import ButtonsGrid from '@src/components/globals/GridButtons';
import LoadingModal from '@src/components/globals/LoadingModal';
import OTP from '@src/components/globals/OTP';
import OTPTimer from '@src/components/globals/OTPTimer';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const Step3_Verify_Phone = () => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const [input, updateInput] = useState<string>('');
  const { handleBusinessLogout } = useBusinessLogout();
  const [verifySignupPhone, { isLoading }] =
    useBusinessVerifyPhoneSignUpMutation();
  const [otpExpired, setOTPExpired] = useState(false);
  const [timerKey, setTimerKey] = useState(Date.now());
  const [resendBusinessPhoneOtp, { isLoading: resendOtpLoading }] =
    useResendBusinessPhoneOtpMutation();
  const [updatePhoneNumber, { isLoading: updatePhoneLoading }] =
    useUpdateBusinessPhoneNumberMutation();
  const handleVerifyOTP = useCallback(async (enteredOtp: string) => {
    try {
      const verifyOtpData = {
        otp: enteredOtp,
        otpTypes: 'verifyMobile',
      };
      const result = await verifySignupPhone(verifyOtpData).unwrap();
      if (result) {
        renderToastSuccess(result.message);
        updateInput('');
        // if (next) next?.();
      }
    } catch (error: any) {
      updateInput('');
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!otpExpired) {
      const timer = setTimeout(() => setOTPExpired(true), 60000); // Set OTP expiration after 60 seconds
      return () => clearTimeout(timer); // Cleanup function
    }
  }, []);

  const [, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const closeBottomSheet = () => {
    formik?.resetForm();
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };
  const snapPoints = useMemo(() => ['100%'], []);

  const handleChangePhoneNumber = async (value: any) => {
    try {
      const result = await updatePhoneNumber({
        phoneNumber: value,
      }).unwrap();
      renderToastSuccess('PhoneNumber Updated successfully');
      if (result) {
        await resendBusinessPhoneOtp({
          phoneNumber: value,
        }).unwrap();
        closeBottomSheet();
      }
      setTimerKey(Date.now());
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .min(10, 'Must be 10 characters')
        .max(10, 'Must not be greater than 10 digits')
        .required('Required'),
    }),
    onSubmit: values => {
      const formattedPhoneNumber = `+44${values.phoneNumber.replace(
        /[- ]/g,
        '',
      )}`;

      // const updateData = {
      //   phoneNumber: formattedPhoneNumber,
      // };
      handleChangePhoneNumber(formattedPhoneNumber);
    },
  });
  return (
    <>
      <ScreenAuth
        title="Verify Mobile"
        style={{ backgroundColor: 'transparent' }}
        topColor="transparent"
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
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
          {/* <TouchableOpacity onPress={openBottomSheet}>
            <Text
              style={{
                fontSize: 12,
                textAlign: 'right',
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              Want to change phone number?
            </Text>
          </TouchableOpacity> */}
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
            <View
              style={{ marginTop: vs(6), width: '85%', alignSelf: 'center' }}
            >
              <Button
                btnTitle="Resend"
                onClick={() => {
                  handleResendOtp();
                }}
                disabled={!otpExpired}
                loading={resendOtpLoading}
              />
            </View>
          )}
        </View>
        <LoadingModal isLoading={isLoading} />
      </ScreenAuth>
      <BottomSheet
        handleIndicatorStyle={{ backgroundColor: 'transparent' }}
        backgroundStyle={{ backgroundColor: '#FAF9F6' }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <ScreenAuth
          title="Change Number"
          style={{
            backgroundColor: '#FAF9F6',
          }}
          darkStatus
          topColor="transparent"
          bottomColor={Colors.light.theme.backgroundTopCurveSection}
          appBarProps={{
            light: true,
            rightIcon: true,
          }}
          back={() => {
            closeBottomSheet();
          }}
        >
          <View style={globalStyle.authTopCurvedCard}>
            <KeyboardAwareScrollView
              contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? getRespValue(10) : 20,
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              enableOnAndroid
              extraScrollHeight={20}
              enableAutomaticScroll
              scrollEnabled
              // resetScrollToCoords={{ x: 0, y: 0 }}
              extraHeight={Platform.OS === 'ios' ? getRespValue(250) : 180}
              viewIsInsideTabBar
            >
              <Text
                style={styles.title}
                className="text-black ml-4 font-poppins-medium"
              >
                Change Phone Number
              </Text>
              <Text
                style={styles.subtitle}
                className="text-gray ml-4 font-poppins-medium"
              >
                Please enter your new phone number .
              </Text>
              <View
                style={{
                  marginTop: vs(16),
                  marginLeft: hs(32),
                  marginRight: hs(16),
                }}
              >
                <FormikPhoneInput
                  formik={formik}
                  name="phoneNumber"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    keyboardType: 'phone-pad',
                    returnKeyType: 'done',
                    onChangePhoneNumber(e: any) {
                      // eslint-disable-next-line no-console
                      console.log('input: ', e);
                    },
                  }}
                />
              </View>
              <View style={styles.button}>
                <Button
                  btnTitle="Update"
                  disabled={updatePhoneLoading}
                  loading={updatePhoneLoading}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ScreenAuth>
      </BottomSheet>
    </>
  );
};

export default Step3_Verify_Phone;
const styles = StyleSheet.create({
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(8),
    marginBottom: vs(16),
  },
  title: {
    marginTop: vs(56),
    fontSize: 20,
  },
  subtitle: {
    marginTop: vs(16),
    fontSize: 14,
  },
});
