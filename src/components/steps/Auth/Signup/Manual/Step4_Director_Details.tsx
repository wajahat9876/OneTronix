/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  useBusinessAddDirectorMutation,
  useGetAllDirectorQuery,
} from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Director from '@src/components/commons/business/director';
import Button from '@src/components/globals/Button';
import FormikDatePicker from '@src/components/globals/FormikDatePicker';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import DismissKeyboardView from '@src/components/globals/HideKeyboard';
import Nationality from '@src/components/globals/Nationality';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useRef } from 'react';
import { FlatList, Platform, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Step4_Director_Details = ({ next }: MultiStepFormProps) => {
  const [addDirectorDetails, { isLoading: isAddDirectorLoading }] =
    useBusinessAddDirectorMutation();
  const { handleBusinessLogout } = useBusinessLogout();
  const { data: allDirectorsData, isSuccess: isGetAllDirectorsSuccess } =
    useGetAllDirectorQuery({ type: '1' });
  const businessDetails = useAppSelector(useBusinessDetails);
  const { data: businessData } = businessDetails;
  // only for sole tradrer
  const firstNameRef = useRef() as React.MutableRefObject<TextInput>;
  const middleNameRef = useRef() as React.MutableRefObject<TextInput>;
  const lastNameRef = useRef() as React.MutableRefObject<TextInput>;
  const dateOfBirthRef = useRef() as React.MutableRefObject<TextInput>;
  const cityRef = useRef() as React.MutableRefObject<TextInput>;
  const fAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const sAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const tAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const placeRef = useRef() as React.MutableRefObject<TextInput>;
  const postalCodeRef = useRef() as React.MutableRefObject<TextInput>;
  const emailAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const phoneNumberRef = useRef() as React.MutableRefObject<TextInput>;

  const handleSubmitDirectorDetails = async (values: any) => {
    try {
      const res = await addDirectorDetails(values).unwrap();
      renderToastSuccess(res?.message || 'Success');
      if (res) {
        formik.resetForm();
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      fAddress: '',
      sAddress: '',
      tAddress: '',
      dateOfBirth: '',
      place: '',
      city: '',
      postalCode: '',
      email: '',
      phoneNumber: '',
      nationality: 'British',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .required('Required'),
      middleName: Yup.string().min(2, 'Must be 2 characters or more'),
      lastName: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .required('Required'),
      // company: Yup.string().required('Required'),
      dateOfBirth: Yup.string().required('Required'),
      fAddress: Yup.string().required('Required'),
      sAddress: Yup.string(),
      tAddress: Yup.string(),
      city: Yup.string().required('Required'),
      place: Yup.string().required('Required'),
      postalCode: Yup.string()
        .matches(
          /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i,
          'Invalid UK postal code',
        )
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phoneNumber: Yup.string()
        .min(10, 'Must be 10 characters')
        .max(10, 'Must not be greater than 10 digits')
        .required('Required'),
    }),
    onSubmit: values => {
      const {
        postalCode,
        fAddress,
        sAddress,
        city,
        tAddress,
        lastName,
        middleName,
        phoneNumber,
        ...rest
      } = values;
      const formattedPhoneNumber = `+44${phoneNumber.replace(/[- ]/g, '')}`;
      const updatedData = {
        ...rest,
        phoneNumber: formattedPhoneNumber,
        postalCode,
        fAddress,
        city,
        country: 'GB',
        ...(sAddress?.trim() && { sAddress }),
        ...(tAddress?.trim() && { tAddress }),
        address: {
          fAddress,
          city,
          postalCode, // Matching required structure
          ...(sAddress?.trim() && { sAddress }),
          ...(tAddress?.trim() && { tAddress }),
        },
        ...(middleName && { middleName }),
        ...(lastName && { lastName }),
      };

      handleSubmitDirectorDetails(updatedData);
    },
  });

  return (
    <ScreenAuth
      title="Director Details"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      darkStatus
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        handleBusinessLogout();
      }}
    >
      <View style={globalStyle.authTopCurvedCard}>
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
          <DismissKeyboardView>
            <Text
              style={{
                ...globalStyle.textMedium,
                marginTop: vs(32),
                marginLeft: hs(16),
              }}
            >
              {(allDirectorsData?.data?.length ?? 0) > 0
                ? 'Additional Director Details'
                : 'Add Director Details'}
            </Text>

            {!allDirectorsData && (
              <Text
                style={{
                  ...globalStyle.textRegular,
                  marginTop: vs(8),
                  marginLeft: hs(16),
                }}
              >
                Please Provide details of the director in your Company.
              </Text>
            )}
          </DismissKeyboardView>
          {isGetAllDirectorsSuccess && allDirectorsData && (
            <View
              style={{
                marginLeft: hs(8),
                marginRight: hs(8),
                marginTop: vs(16),
              }}
            >
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={allDirectorsData.data}
                renderItem={({ item }) => {
                  return <Director name={`${item.firstName}`} />;
                }}
              />
            </View>
          )}

          {/* name section */}
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Basic Details
          </Text>

          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={firstNameRef}
              name="firstName"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'First Name',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (middleNameRef?.current) {
                    middleNameRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={middleNameRef}
              name="middleName"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Middle Name (optional)',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (lastNameRef?.current) {
                    lastNameRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={lastNameRef}
              name="lastName"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Last Name',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (emailAddressRef?.current) {
                    emailAddressRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={emailAddressRef}
              name="email"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Email',
                keyboardType: 'email-address',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (phoneNumberRef?.current) {
                    phoneNumberRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikPhoneInput
              formik={formik}
              ref={phoneNumberRef}
              name="phoneNumber"
              inputProps={{
                ...textInputUnderlinedProps,
                returnKeyType: 'done',
                keyboardType: 'phone-pad',
                onChangePhoneNumber(e: any) {
                  // eslint-disable-next-line no-console
                  console.log('input: ', e);
                },
              }}
            />
          </View>

          {/* <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikDropdownRNE
              formik={formik}
              name="gender"
              placeholder="Gender"
              data={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Not Specified', value: 'not specified' },
              ]}
              value={formik?.values?.gender}
              dropdownType="sm"
              labelField="label"
              valueField="value"
              dropdownPosition="bottom"
            />
          </View> */}
          <View style={{ marginTop: vs(16) }}>
            <FormikDatePicker
              ref={dateOfBirthRef}
              formik={formik}
              name="dateOfBirth"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Date of Birth',
                placeholderTextColor: Colors.light.theme.placeholderColor,
              }}
              datePickerProps={{
                maxDate: moment(new Date(), 'YYYY-MM-DD')
                  .subtract(18, 'years')
                  .toDate(),
                date: formik.values.dateOfBirth
                  ? moment(formik.values.dateOfBirth, 'YYYY-MM-DD').toDate()
                  : moment(new Date(), 'YYYY-MM-DD')
                      .subtract(18, 'years')
                      .toDate(),
              }}
            />
          </View>
          {/* address section */}
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Address
          </Text>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={placeRef}
              name="place"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Apartment Number',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (fAddressRef?.current) {
                    fAddressRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={fAddressRef}
              name="fAddress"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Address Line 1',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (sAddressRef?.current) {
                    sAddressRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={sAddressRef}
              name="sAddress"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Address Line 2 (optional)',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (tAddressRef?.current) {
                    tAddressRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={tAddressRef}
              name="tAddress"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Address Line 3 (optional)',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (postalCodeRef?.current) {
                    postalCodeRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
            <FormikInput
              formik={formik}
              ref={postalCodeRef}
              name="postalCode"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Postal code',
                returnKeyType: 'done',
                onSubmitEditing: () => {
                  if (cityRef?.current) {
                    cityRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={[styles.textInput, { marginTop: vs(16) }]}>
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
          <View
            style={{
              ...styles.textInput,
              marginLeft: hs(32),
              marginTop: vs(16),
            }}
          >
            <Nationality />
          </View>

          <View style={styles.buttonsRow}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <Button
                btnTitle="Submit"
                loading={isAddDirectorLoading}
                disabled={
                  businessData?.numberOfDirectors ===
                  allDirectorsData?.data?.length
                }
                btnTitleColor={Colors.light.theme.white}
                onClick={() => {
                  formik.handleSubmit();
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ScreenAuth>
  );
};
const styles = StyleSheet.create({
  textInput: {
    marginLeft: hs(32),
    marginRight: hs(16),
    marginTop: vs(8),
  },
  button: {
    marginTop: vs(32),
    marginBottom: vs(24),
    marginLeft: hs(16),
    marginRight: hs(8),
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: hs(32),
    marginTop: vs(32),
    marginBottom: vs(32),
    marginLeft: hs(12),
    marginRight: hs(16),
  },
});
export default Step4_Director_Details;
