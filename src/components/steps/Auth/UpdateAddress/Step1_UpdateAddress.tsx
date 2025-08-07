/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useUpdateAddressMutation } from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Button from '@src/components/globals/Button';
import FormikInput from '@src/components/globals/FormikInput';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { useFormik } from 'formik';
import { useRef } from 'react';
import { Keyboard, Platform, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const Step1_UpdateAddress = ({ back, next }: MultiStepFormProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const [updateAddress, { isLoading }] = useUpdateAddressMutation();
  const { handleBusinessLogout } = useBusinessLogout();
  const handleUpdateAddress = async (values: any) => {
    Keyboard.dismiss();
    try {
      const result = await updateAddress(values).unwrap();
      if (result) {
        renderToastSuccess(result?.message);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };
  const formik = useFormik({
    initialValues: {
      fAddress: '',
      city: '',
      postalCode: '',
    },
    validationSchema: Yup.object({
      fAddress: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      postalCode: Yup.string()
        .matches(
          /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i,
          'Invalid UK postal code',
        )
        .required('Required'),
    }),
    onSubmit: values => {
      const { fAddress, city, postalCode } = values;
      const address = {
        fAddress,
        city,
        postalCode,
      };
      const updatedData = {
        peopleId: businessData?.mainApplicant?.directors?.[0]?.peopleId,
        mainApplicantId: businessData?.mainApplicant?.id,
        address,
      };
      handleUpdateAddress(updatedData);
    },
  });

  const fAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const cityRef = useRef() as React.MutableRefObject<TextInput>;
  const postalCodeRef = useRef() as React.MutableRefObject<TextInput>;

  return (
    <ScreenAuth
      title="Update MainApplicant Address"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      //   topColor="transparent"
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      //   bottomColor={Colors.light.theme.backgroundTopCurveSection}
      back={() => {
        handleBusinessLogout();
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
          extraHeight={Platform.OS === 'ios' ? getRespValue(250) : 180}
          viewIsInsideTabBar
          keyboardOpeningTime={0}
        >
          {/* <DismissKeyboardView> */}
          <Text
            style={{
              // ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              alignSelf: 'center',
              fontWeight: '600',
            }}
          >
            Please Provide main applicant address:
          </Text>
          {/* </DismissKeyboardView> */}

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={fAddressRef}
              name="fAddress"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Address',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (postalCodeRef?.current) {
                    postalCodeRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={postalCodeRef}
              name="postalCode"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Postal Code',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (cityRef?.current) {
                    cityRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={cityRef}
              name="city"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'City',
                returnKeyType: 'next',
                onSubmitEditing: () => {},
              }}
            />
          </View>

          <View style={{ ...globalStyle.buttonContinue }}>
            <Button
              btnTitle="Continue"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                formik.handleSubmit();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ScreenAuth>
  );
};
const styles = StyleSheet.create({
  textInput: {
    marginLeft: hs(22),
    marginRight: hs(16),
    marginTop: vs(16),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(8),
    marginBottom: vs(32),
  },
});
export default Step1_UpdateAddress;
