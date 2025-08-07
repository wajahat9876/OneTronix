/* eslint-disable import/order */
/* eslint-disable camelcase */
// eslint-disable-next-line import/order
import { useBusinessInfoMutation } from '@/store/api/business/authApis';
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Button from '@src/components/globals/Button';
import Checkbox from '@src/components/globals/Checkbox';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { kycStyles } from '@src/styles/KYC';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const Step0_Upload_Business_Information = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { handleBusinessLogout } = useBusinessLogout();
  const [termsOn, setTermsON] = useState('off');
  const [partner, setPartner] = useState('false');
  const [businessInfo, { isLoading }] = useBusinessInfoMutation();
  const toggleTerms = () => {
    const newTermsState = termsOn === 'off' ? 'on' : 'off';
    setTermsON(newTermsState);
    if (newTermsState === 'on') {
      setPartner('true');
    } else {
      setPartner('false');
    }
  };
  const handleSubmit = async (values: any) => {
    try {
      const res = await businessInfo(values).unwrap();
      renderToastSuccess(res?.message || 'Signup Verified');
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const formik = useFormik({
    initialValues: {
      productService: '',
      aboutECC: '',
      customerList: '',
      fundSource: '',
      supplierList: '',
      email: '',
      phoneNumber: '',
      registrationNo: '',
      countryTo: '',
    },
    validationSchema: Yup.object({
      registrationNo: Yup.string().required('Required'),
      phoneNumber: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must not be greater than 10 digits')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      countryTo: Yup.string().required('Required'),
      customerList: Yup.string().required('Required'),
      fundSource: Yup.string().required('Required'),
      supplierList: Yup.string().required('Required'),
      productService: Yup.string().required('Required'),
      aboutECC: Yup.string().required('Required'),
    }),

    onSubmit: async values => {
      Keyboard.dismiss();
      // const transformData = [
      //   {
      //     Question: 'Who are your Customers and where are they Based?',
      //     Answer: values?.customerList,
      //   },
      //   {
      //     Question: 'What is the source of your funds?',
      //     Answer: values?.fundSource,
      //   },
      //   {
      //     Question:
      //       'Who are your suppliers? Please provide their website address, if any?',
      //     Answer: values?.supplierList,
      //   },
      //   {
      //     Question:
      //       'What product & services your business provides? How do you operate your business?',
      //     Answer: values?.productService,
      //   },
      //   {
      //     Question: 'Enter your business email.',
      //     Answer: values?.email,
      //   },
      //   {
      //     Question: 'Enter your phone number.',
      //     Answer: `+44${values.phoneNumber.replace(/[- ]/g, '')}`,
      //   },
      //   {
      //     Question: 'Regulatory registration number & detailes if applicable',
      //     Answer: values?.registrationNo,
      //   },
      //   {
      //     Question: 'How did you hear about ECC',
      //     Answer: values?.aboutECC,
      //   },
      //   {
      //     Question: 'Countries you would be sending payments to?',
      //     Answer: values?.countryTo,
      //   },
      //   {
      //     Question:
      //       'Does your business have international partners or suppliers?',
      //     Answer: partner,
      //   },
      // ];
      const formattedPhoneNumber = `+44${values.phoneNumber.replace(
        /[- ]/g,
        '',
      )}`;
      const updatedData = {
        ...values,
        phoneNumber: formattedPhoneNumber,
        intPartner: partner,
      };
      handleSubmit(updatedData);
    },
  });
  const businessregistrationNoRef =
    useRef() as React.MutableRefObject<TextInput>;
  const phoneNumberRef = useRef() as React.MutableRefObject<TextInput>;
  const emailRef = useRef() as React.MutableRefObject<TextInput>;
  const supplierListRef = useRef() as React.MutableRefObject<TextInput>;
  const productServiceRef = useRef() as React.MutableRefObject<TextInput>;
  const fundSourceRef = useRef() as React.MutableRefObject<TextInput>;
  const customerRef = useRef() as React.MutableRefObject<TextInput>;
  const countryToRef = useRef() as React.MutableRefObject<TextInput>;
  const aboutECCRef = useRef() as React.MutableRefObject<TextInput>;

  return (
    <ScreenAuth
      title="Business Documentation"
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
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <Text style={{ ...kycStyles.heading, marginTop: vs(16) }}>
          Add Business Information
        </Text>

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
          {/* business details section */}
          <Text style={styles.subHeading}>
            Who are your customer and where do they live?
          </Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={customerRef}
              name="customerList"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Enter Customers',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (fundSourceRef?.current) {
                    fundSourceRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>
            What is the Source of your Funds?
          </Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={fundSourceRef}
              name="fundSource"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'E.G, Through company, Director etc',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (supplierListRef?.current) {
                    supplierListRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>Who are your Suppliers?</Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={supplierListRef}
              name="supplierList"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Enter Suppliers',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (productServiceRef?.current) {
                    productServiceRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>
            What product & services your business provides?
          </Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={productServiceRef}
              name="productService"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Enter Products/Services',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (emailRef?.current) {
                    emailRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>Enter your Business Email?</Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={emailRef}
              name="email"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Business Email',
                returnKeyType: 'next',
                keyboardType: 'email-address',
                onSubmitEditing: () => {
                  if (phoneNumberRef?.current) {
                    phoneNumberRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>Enter your Phone Number?</Text>
          <View style={styles.textInput}>
            <FormikPhoneInput
              formik={formik}
              ref={phoneNumberRef}
              name="phoneNumber"
              inputProps={{
                ...textInputUnderlinedProps,
                backgroundColor: 'transparent',
                returnKeyType: 'done',
                keyboardType: 'phone-pad',
                onChangePhoneNumber(e: any) {
                  // eslint-disable-next-line no-console
                  console.log('input: ', e);
                },
                onSubmitEditing: () => {
                  if (businessregistrationNoRef?.current) {
                    businessregistrationNoRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>
            Enter Your Regulatory registration number & detailes
          </Text>
          <View style={[styles.textInput, { marginTop: 10 }]}>
            <FormikInput
              formik={formik}
              ref={businessregistrationNoRef}
              name="registrationNo"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Regulatory Registration Number',
                returnKeyType: 'next',
                keyboardType: 'url',
                onSubmitEditing: () => {
                  if (aboutECCRef?.current) {
                    aboutECCRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>How did you hear about ECC?</Text>
          <View style={[styles.textInput, { marginTop: 10 }]}>
            <FormikInput
              formik={formik}
              ref={aboutECCRef}
              name="aboutECC"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'About ECC',
                returnKeyType: 'next',
                keyboardType: 'url',
                onSubmitEditing: () => {
                  if (countryToRef?.current) {
                    countryToRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <Text style={styles.subHeading}>
            Countries you would be sending payments to.
          </Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={countryToRef}
              name="countryTo"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Enter Country',
                returnKeyType: 'next',
                //   onSubmitEditing: () => {
                //     if (passCodeRef?.current) {
                //       passCodeRef?.current.focus();
                //     }
                //   },
              }}
            />
          </View>
          <View style={{ width: '100%' }}>
            <Checkbox
              style={{
                marginBottom: termsOn ? vs(100) : 0,
              }}
              className="justify-start"
              value={termsOn}
              onPress={() => {
                toggleTerms();
              }}
              label="Does your business have International partners?"
            />
          </View>
          <View style={styles.button}>
            <Button
              btnTitle="Continue"
              loading={isLoading || isFetching}
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

export default Step0_Upload_Business_Information;
const styles = StyleSheet.create({
  textInput: {
    marginLeft: hs(32),
    marginRight: hs(16),
    // marginTop: vs(10),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(8),
    marginBottom: vs(32),
  },
  subHeading: {
    marginTop: vs(18),
    fontSize: 14,
    paddingLeft: 14,
    fontWeight: '600',
    // fontFamily: 'poppins',
    marginLeft: hs(16),
    marginBottom: getRespValue(12),
  },
});
