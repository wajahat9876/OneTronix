/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useVerifyBusinessPassCodeMutation } from '@/store/api/business/authApis';
import { useOutgoingTransactionBusinessMutation } from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import ButtonsGrid from '@src/components/globals/GridButtons';
import LoadingModal from '@src/components/globals/LoadingModal';
import OTP from '@src/components/globals/OTP';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { kycStyles } from '@src/styles/KYC';
import { vs } from '@utils/design/design';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

const Step5_Payment_Otp = ({ goTo }: MultiStepFormProps) => {
  const [input, updateInput] = useState<string>('');
  const [verifyBusinessPasscode, { isLoading: businessLoading }] =
    useVerifyBusinessPassCodeMutation();
  const [outgoingTransaction, { isLoading }] =
    useOutgoingTransactionBusinessMutation();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    lastSelectedBusinessBenefDetails,
    outgoingBusReduxData,
    data: businessData,
  } = useAppSelector(useBusinessDetails);
  const reset = useCallback(() => {
    updateInput('');
    setHasSubmitted(false);
  }, []);

  const outgoingTransfer = async () => {
    try {
      const res = await outgoingTransaction({
        benefAcccountDetailsId: lastSelectedBusinessBenefDetails?._id,
        amount: parseFloat(outgoingBusReduxData?.amount || '0'),
        transferReasonId: outgoingBusReduxData?.transferReasonId,
        description: outgoingBusReduxData?.description.trim(),
      }).unwrap();
      goTo?.(6);
      renderToastSuccess(res?.message || 'Success');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Failed');
      goTo?.(7);
    }
  };
  const handleUserSubmit = async (pin: string) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);

    try {
      const res = await verifyBusinessPasscode({
        passCode: pin,
      }).unwrap();
      outgoingTransfer();
      renderToastSuccess(res?.message || 'Confirm Successfully');
      updateInput('');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'PassCode Failed');
      updateInput('');
      setHasSubmitted(false);
    }
  };

  useEffect(() => {
    if (input.length === 4 && !hasSubmitted) {
      if (
        lastSelectedBusinessBenefDetails?.currency !==
        businessData?.activeCurrency
      ) {
        renderToastError(
          `Switch your currency to ${lastSelectedBusinessBenefDetails?.currency}`,
        );
        reset();
      } else {
        handleUserSubmit(input);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, hasSubmitted]);
  const handleBiometricSuccess = () => {
    outgoingTransfer();
    updateInput('');
    setHasSubmitted(false);
  };
  return (
    <View style={globalStyle.mainBlackBackground}>
      <ScreenAuth
        title="Verify Pin"
        style={{
          backgroundColor: 'transparent',
        }}
        topColor="transparent"
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        appBarProps={{
          light: false,
          rightIcon: true,
        }}
        back={() => {
          goTo?.(0);
        }}
      >
        <View style={[globalStyle.mainTopCurvedCard]}>
          <Text style={kycStyles.heading}>Enter Pin Code</Text>
          <Text style={kycStyles.subHeading}>
            Please confirm your chosen 4-digit PIN for payment security.
          </Text>

          <View className="justify-center items-center mt-2">
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
              showBiometric
              onBiometricSuccess={handleBiometricSuccess}
              // onMaxReached={pin => {
              //   handleSubmit(pin);
              // }}
            />
          </View>
        </View>
        <LoadingModal isLoading={businessLoading || isLoading} />
      </ScreenAuth>
    </View>
  );
};

export default Step5_Payment_Otp;
