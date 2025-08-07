/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useBusinessAutoSignupMutation,
  useGetActiveCompaniesQuery,
} from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import { useConfig } from '@/store/selectors/config/config';
import { resetBusinessTempToken } from '@/store/slices/business/businessSlice';
import IconStepDone from '@assets/icons/signup/icon-step-done.svg';
import Button from '@src/components/globals/Button';
import FormikDropdownRNE from '@src/components/globals/DropdownRNE/FormikDropdownRNE';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, TextInput, View } from 'react-native';
import { IDropdownRef } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const Step1_Business_Details = ({ back }: MultiStepFormProps) => {
  const businessSelector = useAppSelector(useBusinessDetails);
  const { businessType, packageId, data } = businessSelector;
  const [signupBusiness, { isLoading }] = useBusinessAutoSignupMutation();
  const [containerData, setContainerData] = useState(false);
  const { pushToken, deviceModal, deviceId, deviceType } =
    useAppSelector(useConfig);
  const router = useRouter();
  // const businessNameRef = useRef() as React.MutableRefObject<TextInput>;
  const phoneNumberRef = useRef() as React.MutableRefObject<TextInput>;
  const emailRef = useRef() as React.MutableRefObject<TextInput>;
  const passwordRef = useRef() as React.MutableRefObject<TextInput>;
  const confirmPasswordRef = useRef() as React.MutableRefObject<TextInput>;
  const averageSinglePaymentRef = useRef() as React.MutableRefObject<TextInput>;
  const averagePerWeekPaymentRef =
    useRef() as React.MutableRefObject<TextInput>;
  const annualTrunoverRef = useRef() as React.MutableRefObject<TextInput>;
  const typicallyLargePaymentRef =
    useRef() as React.MutableRefObject<TextInput>;
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regNumber, setRegNumber] = useState('');
  const {
    data: activeCompanies,
    isLoading: isActiveCompaniesLoading,
    refetch,
  } = useGetActiveCompaniesQuery(
    { nameSearch: searchTerm },
    {
      skip: !searchTerm || searchTerm.replace(/ /g, '') === '',
    },
  );

  const handleBusinessSignup = async (values: any) => {
    dispatch(resetBusinessTempToken());
    try {
      const result = await signupBusiness(values).unwrap();

      if (result) {
        renderToastSuccess(result.message);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };
  const dropdownRef = useRef<IDropdownRef>(null);
  const formik = useFormik({
    initialValues: {
      businessName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      averageSinglePayment: '',
      averagePerWeekPayment: '',
      annualTrunover: '',
      typicallyLagerPayment: '',
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required('Required'),
      phoneNumber: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must not be greater than 10 digits')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Atleast one LowerCase letter Require')
        .matches(/[A-Z]/, 'Atleast one Uppercase Letter Require')
        .matches(/[0-9]/, 'Atleast One Number Require')
        .matches(/[@$!%*?&#]/, 'Atleast One Special Character Require')
        .required('Required'),
      confirmPassword: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password'), ''], 'Password must match'),
      averageSinglePayment: Yup.string().required('Required'),
      averagePerWeekPayment: Yup.string().required('Required'),
      annualTrunover: Yup.string().required('Required'),
      typicallyLagerPayment: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      const formattedPhoneNumber = `+44${values.phoneNumber.replace(
        /[- ]/g,
        '',
      )}`;
      const updateData = {
        packageId,
        ...values,
        notificationToken: pushToken,
        deviceOS: Platform.OS,
        deviceModal,
        deviceId,
        deviceType,
        businessType,
        regNo: regNumber,
        phoneNumber: formattedPhoneNumber,

        typicallyLagerPayment: parseFloat(values?.typicallyLagerPayment),
        annualTrunover: parseFloat(values?.annualTrunover),
        averageSinglePayment: parseFloat(values?.averageSinglePayment),
        averagePerWeekPayment: parseFloat(values?.averagePerWeekPayment),
      };
      handleBusinessSignup(updateData);
    },
  });

  const setCompanyNameDebounce = debounce((searchQuery: string) => {
    setSearchTerm(searchQuery);
  }, 500);

  const setSearchQuery = useCallback((search: string) => {
    setCompanyNameDebounce(search);
  }, []);

  const companiesList = useMemo(() => {
    return activeCompanies?.data?.companies.map(company => ({
      label: `${company.name}`,
      value: company.regNo,
    }));
  }, [activeCompanies?.data]);

  useEffect(() => {
    if (searchTerm) {
      refetch();
    }
  }, [refetch, searchTerm]);

  return (
    <ScreenAuth
      title="Business Details"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      back={() => {
        if (router.canGoBack()) router.back();
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
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              alignSelf: 'center',
            }}
          >
            Please fill out below fields
          </Text>

          {/* business details section */}
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Business Details
          </Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <FormikDropdownRNE
              formik={formik}
              key="sa"
              ref={dropdownRef}
              name="businessName"
              placeholder="Select Business Name"
              placeholderStyle={{ color: 'gray', padding: 5 }}
              data={companiesList || []}
              search
              searchPlaceholder="Search here..."
              onChangeText={e => {
                setSearchQuery(e);
              }}
              onChange={value => {
                setRegNumber(value);
                // Find the selected item from the list using the value
                const selectedItem = companiesList?.find(
                  item => item.value === value,
                );
                if (selectedItem) {
                  formik.setFieldValue('businessName', selectedItem.label);
                }
              }}
              style={{
                width: '85%',
                borderBottomWidth: 1.5,
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
                borderColor: '#BABABA',
                marginLeft: hs(32),
                marginRight: hs(16),
                marginTop: vs(16),
              }}
              maxHeight={250}
              itemContainerStyle={{
                borderBottomWidth: 0,
              }}
              selectedTextStyle={{ fontSize: 14, padding: 5 }}
              value={formik?.values?.businessName}
              dropdownType="lg"
              labelField="label"
              valueField="label"
              dropdownPosition="bottom"
              containerStyle={{ flex: 1 }}
              renderItem={item => {
                return (
                  <>
                    {isActiveCompaniesLoading && <Text>Loading</Text>}
                    {!containerData ? (
                      <Text
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          borderColor: 'gray',
                          fontSize: 14,
                        }}
                      >
                        {item.label}
                      </Text>
                    ) : (
                      <Text style={{ backgroundColor: 'red' }}>Search</Text>
                    )}
                  </>
                );
              }}
            />
          </View>
          <View style={styles.textInput}>
            {/* <FormikInput
                formik={formik}
                ref={emailRef}
                name="businessName"
                inputProps={{
                  ...textInputUnderlinedProps,
                  type: 'underlined',
                  placeholder: 'Business Name',
                  returnKeyType: 'next',
                  onSubmitEditing: () => {
                    if (phoneNumberRef?.current) {
                      phoneNumberRef.current.focus();
                    }
                  },
                }}
              /> */}

            {/* <FormikDropDown
                formik={formik}
                name="gender"
                placeHolderText="Business"
                isSearchable
                hideArrow
                optionsListStyle={{
                  maxHeight: vs(300),
                }}
                // flatListProps={{
                //   style: { backgroundColor: 'red', height: vs(200) },
                //   CellRendererComponent: ({ item }: any) => {
                //     return (
                //       <>
                //         {isActiveCompaniesLoading && (
                //           <Text>Loading Companies</Text>
                //         )}
                //         <Text>{item.label}</Text>
                //       </>
                //     );
                //   },
                // }}
                onSelectChangeText={text => {
                  setSearchQuery(text);
                }}
                data={companiesList || []}
                // data={[
                //   { label: 'Male', value: 'male' },
                //   { label: 'Female', value: 'female' },
                //   { label: 'Codingzest', value: 'codingzest' },
                //   { label: 'AppsForNexus', value: 'appsfornexus' },
                //   { label: 'Anemoia', value: 'anemoia' },
                //   { label: 'Netsol', value: 'netsol' },
                //   { label: 'Aymakan', value: 'aymakan' },
                //   { label: 'MileSpeed', value: 'milespeed' },
                //   { label: 'PlanetBeyond', value: 'pb' },
                //   { label: 'CodeInformtics', value: 'codeinformatics' },
                //   { label: 'FunPrime', value: 'funprime' },
                //   { label: '9DTechnologies', value: '9dtech' },
                //   { label: 'Appinators', value: 'appinator' },
                //   { label: 'GenesisX', value: 'genesisx' },
                // ]}
              /> */}
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={emailRef}
              name="email"
              inputProps={{
                ...textInputUnderlinedProps,
                type: 'underlined',
                placeholder: 'Email',
                keyboardType: 'email-address',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (phoneNumberRef?.current) {
                    phoneNumberRef.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikPhoneInput
              formik={formik}
              ref={phoneNumberRef}
              name="phoneNumber"
              inputProps={{
                ...textInputUnderlinedProps,
                keyboardType: 'phone-pad',
                returnKeyType: 'done',
                onChangePhoneNumber(e: any) {
                  // eslint-disable-next-line no-console
                  console.log('input: ', e);
                },
                onSubmitEditing: () => {
                  if (passwordRef?.current) {
                    passwordRef.current.focus();
                  }
                },
              }}
            />
          </View>

          {/* create password section */}
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Create Password
          </Text>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={passwordRef}
              name="password"
              inputProps={{
                ...textInputUnderlinedProps,
                password: true,
                placeholder: 'Password',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (confirmPasswordRef?.current) {
                    confirmPasswordRef.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={confirmPasswordRef}
              name="confirmPassword"
              inputProps={{
                ...textInputUnderlinedProps,
                password: true,
                placeholder: 'Re-enter Password',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (averageSinglePaymentRef?.current) {
                    averageSinglePaymentRef.current.focus();
                  }
                },
              }}
            />
          </View>

          {/* additional information section */}
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Additional Information
          </Text>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={averageSinglePaymentRef}
              name="averageSinglePayment"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Average Single Payment',
                keyboardType: 'number-pad',
                returnKeyType: 'done',
                onSubmitEditing: () => {
                  if (averagePerWeekPaymentRef?.current) {
                    averagePerWeekPaymentRef.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={averagePerWeekPaymentRef}
              name="averagePerWeekPayment"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Average Per Week Payment',
                keyboardType: 'number-pad',
                returnKeyType: 'done',
                onSubmitEditing: () => {
                  if (annualTrunoverRef?.current) {
                    annualTrunoverRef.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={annualTrunoverRef}
              name="annualTrunover"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Annual Turnover ',
                keyboardType: 'number-pad',
                returnKeyType: 'done',
                onSubmitEditing: () => {
                  if (typicallyLargePaymentRef.current) {
                    typicallyLargePaymentRef.current?.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={typicallyLargePaymentRef}
              name="typicallyLagerPayment"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Typically Larger Payment',
                keyboardType: 'number-pad',
                returnKeyType: 'done',
              }}
            />
          </View>

          <View style={styles.button}>
            <Button
              btnTitle="Continue"
              loading={isLoading}
              onClick={() => {
                // if (next) next?.();
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
    marginLeft: hs(32),
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
export default Step1_Business_Details;
