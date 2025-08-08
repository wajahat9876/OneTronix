/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useBusinessManualSignupMutation } from "@/store/api/business/authApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import { useConfig } from "@/store/selectors/config/config";
import IconStepDone from "@assets/icons/signup/icon-step-done.svg";
import Button from "@src/components/globals/Button";
import FormikDatePicker from "@src/components/globals/FormikDatePicker";
import FormikInput from "@src/components/globals/FormikInput";
import FormikPhoneInput from "@src/components/globals/FormikPhoneInput";
import DismissKeyboardView from "@src/components/globals/HideKeyboard";
import Nationality from "@src/components/globals/Nationality";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import SignupStepsHeader from "@src/components/globals/SignupStepsHeader";
import { StyleSheet, Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { textInputUnderlinedProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { globalStyle } from "@src/styles/globals";
import { hs, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import IconStepInProgress from "assets/icons/signup/icon-step-in-progress-ecc.svg";
import IconStepRemaining from "assets/icons/signup/icon-step-remaining.svg";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import moment from "moment";
import { useRef } from "react";
import { Keyboard, Platform, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

const Step1_Details = ({ back, next }: MultiStepFormProps) => {
  const businessSelector = useAppSelector(useBusinessDetails);
  const { businessType, packageId } = businessSelector;
  const { pushToken, deviceModal, deviceId, deviceType } =
    useAppSelector(useConfig);

  const [signupBusiness, { isLoading }] = useBusinessManualSignupMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      businessName: "",
      regNo: "",
      phoneNumber: "",
      businessEmail: "",
      businessWebsite: "",
      incorporationNumber: "",
      numberOfDirectors: "",
      registrationDate: "",
      startedTradingDate: "",
      addressLineOne: "",
      addressLineTwo: "",
      addressLineThree: "",
      city: "",
      country: "",
      passCode: "",
      place: "",
      email: "",
      password: "",
      confirmPassword: "",
      averageSinglePayment: "",
      averagePerWeekPayment: "",
      annualTrunover: "",
      typicallyLagerPayment: "",
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required("Required"),
      regNo: Yup.string()
        .required("Required")
        .min(8, "Must be 8 character long"),
      phoneNumber: Yup.string()
        .min(10, "Must be 10 digits")
        .max(10, "Must not be greater than 10 digits")
        .required("Required"),
      businessEmail: Yup.string()
        .email("Invalid email address")
        .required("Required"),
      businessWebsite: Yup.string()
        .url("Invalid website link")
        .required("Required"),
      incorporationNumber: Yup.string().required("Required"),
      // numberOfDirectors: Yup.string().when('businessCategory', () => {
      //   return businessCategory === 'ltd'
      //     ? Yup.string().required('Required')
      //     : Yup.string();
      // }),
      numberOfDirectors: Yup.string().required("Required"),
      registrationDate: Yup.date()
        .typeError("Registration date must be a valid date")
        .nullable()
        .required("Registration date is required")
        .max(
          new Date(Date.now() - 86400000),
          "Registration date cannot be today or in the future"
        ),

      startedTradingDate: Yup.date()
        .typeError("Started trading date must be a valid date")
        .nullable()
        .required("Started trading date is required")
        .test(
          "is-after-or-same",
          "Trading date must be on or after registration date",
          function (value) {
            // eslint-disable-next-line react/no-this-in-sfc
            const { registrationDate } = this.parent;

            if (!value || !registrationDate) return true;

            return (
              new Date(value).getTime() >= new Date(registrationDate).getTime()
            );
          }
        ),
      addressLineOne: Yup.string().required("Required"),
      addressLineTwo: Yup.string(),
      addressLineThree: Yup.string(),
      city: Yup.string().required("Required"),
      // country: Yup.string().required('Required'),
      passCode: Yup.string()
        .matches(
          /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i,
          "Invalid UK postal code"
        )
        .required("Required"),
      place: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Atleast one LowerCase letter Require")
        .matches(/[A-Z]/, "Atleast one Uppercase Letter Require")
        .matches(/[0-9]/, "Atleast One Number Require")
        .matches(/[@$!%*?&#]/, "Atleast One Special Character Require")
        .required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "Password must match"),
      averageSinglePayment: Yup.string()
        .required("Required")
        .matches(/^[0-9]+$/, "Only numbers are allowed"),
      averagePerWeekPayment: Yup.string()
        .required("Required")
        .matches(/^[0-9]+$/, "Only numbers are allowed"),
      annualTrunover: Yup.string()
        .required("Required")
        .matches(/^[0-9]+$/, "Only numbers are allowed"),
      typicallyLagerPayment: Yup.string()
        .required("Required")
        .matches(/^[0-9]+$/, "Only numbers are allowed"),
    }),
    onSubmit: (values) => {
      const { addressLineOne, addressLineTwo, addressLineThree, ...rest } =
        values;
      const formattedPhoneNumber = `+44${rest.phoneNumber.replace(
        /[- ]/g,
        ""
      )}`;
      const address = {
        line1: addressLineOne.trim(),
        ...(addressLineTwo?.trim() && { line2: addressLineTwo }),
        ...(addressLineThree?.trim() && { line3: addressLineThree }),
      };
      const updatedData = {
        packageId,
        notificationToken: pushToken,
        deviceOS: Platform.OS,
        deviceModal,
        deviceId,
        deviceType,
        businessType,
        ...rest,
        phoneNumber: formattedPhoneNumber,
        typicallyLagerPayment: values?.typicallyLagerPayment,
        // parseFloat(values?.typicallyLagerPayment),
        annualTrunover: values?.annualTrunover,
        averageSinglePayment: values?.averageSinglePayment,
        averagePerWeekPayment: values?.averagePerWeekPayment,
        country: "GB",
        numberOfDirectors: parseInt(rest.numberOfDirectors, 10),
        address,
      };
      handleBusinessSignup(updatedData);
    },
  });

  const businessNameRef = useRef() as React.MutableRefObject<TextInput>;
  const businessRegNoRef = useRef() as React.MutableRefObject<TextInput>;
  const phoneNumberRef = useRef() as React.MutableRefObject<TextInput>;
  const businessEmailRef = useRef() as React.MutableRefObject<TextInput>;
  const businessWebsiteRef = useRef() as React.MutableRefObject<TextInput>;
  const incorporationNumberRef = useRef() as React.MutableRefObject<TextInput>;
  const numberOfDirectorsRef = useRef() as React.MutableRefObject<TextInput>;
  const addressLine1Ref = useRef() as React.MutableRefObject<TextInput>;
  const addressLine2Ref = useRef() as React.MutableRefObject<TextInput>;
  const addressLine3Ref = useRef() as React.MutableRefObject<TextInput>;
  const cityRef = useRef() as React.MutableRefObject<TextInput>;
  const passCodeRef = useRef() as React.MutableRefObject<TextInput>;
  const placeRef = useRef() as React.MutableRefObject<TextInput>;
  const emailRef = useRef() as React.MutableRefObject<TextInput>;
  const passwordRef = useRef() as React.MutableRefObject<TextInput>;
  const confirmPasswordRef = useRef() as React.MutableRefObject<TextInput>;
  const averageSinglePaymentRef = useRef() as React.MutableRefObject<TextInput>;
  const averagePerWeekPaymentRef =
    useRef() as React.MutableRefObject<TextInput>;
  const annualTrunoverRef = useRef() as React.MutableRefObject<TextInput>;
  const typicallyLagerPaymentRef =
    useRef() as React.MutableRefObject<TextInput>;

  const handleBusinessSignup = async (values: any) => {
    Keyboard.dismiss();
    try {
      const result = await signupBusiness(values).unwrap();
      if (result) {
        renderToastSuccess(result?.message);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };

  return (
    <ScreenAuth
      title="Business Details"
      style={{ backgroundColor: "transparent" }}
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

        {/* <KeyboardAwareScrollView
          bottomOffset={100}
          keyboardShouldPersistTaps="handled"
          style={{
            flex: 1,
            paddingHorizontal: hs(0.1),
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            paddingTop: vs(0),
            flexGrow: 1,
          }}
        > */}
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? getRespValue(10) : 20,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={20}
          enableAutomaticScroll
          scrollEnabled
          extraHeight={Platform.OS === "ios" ? getRespValue(250) : 180}
          viewIsInsideTabBar
          keyboardOpeningTime={0}
        >
          <DismissKeyboardView>
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(32),
                alignSelf: "center",
              }}
            >
              Please fill out below fields
            </Text>
          </DismissKeyboardView>
          {/* business details section */}
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Business Registration
          </Text>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={businessNameRef}
              name="businessName"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Business Name",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (businessRegNoRef?.current) {
                    businessRegNoRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={businessRegNoRef}
              name="regNo"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Business Registration #",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (phoneNumberRef?.current) {
                    phoneNumberRef?.current.focus();
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
                backgroundColor: "transparent",
                returnKeyType: "done",
                keyboardType: "phone-pad",
                onChangePhoneNumber(e: any) {
                  // eslint-disable-next-line no-console
                  console.log("input: ", e);
                },
                onSubmitEditing: () => {
                  if (businessEmailRef?.current) {
                    businessEmailRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={businessEmailRef}
              name="businessEmail"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Business Email",
                returnKeyType: "next",
                keyboardType: "email-address",
                onSubmitEditing: () => {
                  if (businessWebsiteRef?.current) {
                    businessWebsiteRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={businessWebsiteRef}
              name="businessWebsite"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Business website(https://test.com)",
                returnKeyType: "next",
                keyboardType: "url",
                onSubmitEditing: () => {
                  if (incorporationNumberRef?.current) {
                    incorporationNumberRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={incorporationNumberRef}
              name="incorporationNumber"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Incorporation Number",
                returnKeyType: "next",
                keyboardType: "email-address",
                onSubmitEditing: () => {
                  if (numberOfDirectorsRef?.current) {
                    numberOfDirectorsRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={numberOfDirectorsRef}
              name="numberOfDirectors"
              inputProps={{
                ...textInputUnderlinedProps,
                keyboardType: "numeric",
                placeholder: "Number of Directors / Partners ",
                backgroundColor: "transparent",
                returnKeyType: "done",
              }}
            />
          </View>

          <View style={[styles.textInput, { marginLeft: 0, marginRight: 0 }]}>
            <FormikDatePicker
              formik={formik}
              name="registrationDate"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Date of Registration",
                placeholderTextColor: Colors.light.theme.placeholderColor,
              }}
              datePickerProps={{
                maxDate: moment(new Date(), "YYYY-MM-DD").toDate(),
                date: formik.values.registrationDate
                  ? moment(
                      formik.values.registrationDate,
                      "YYYY-MM-DD"
                    ).toDate()
                  : moment(new Date(), "YYYY-MM-DD").toDate(),
              }}
            />
          </View>

          <View style={[styles.textInput, { marginLeft: 0, marginRight: 0 }]}>
            <FormikDatePicker
              formik={formik}
              name="startedTradingDate"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Started Trading on",
                placeholderTextColor: Colors.light.theme.placeholderColor,
              }}
              datePickerProps={{
                maxDate: moment(new Date(), "YYYY-MM-DD").toDate(),
                date: formik.values.startedTradingDate
                  ? moment(
                      formik.values.startedTradingDate,
                      "YYYY-MM-DD"
                    ).toDate()
                  : moment(new Date(), "YYYY-MM-DD").toDate(),
              }}
            />
          </View>

          {/* address section */}
          <DismissKeyboardView>
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
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={placeRef}
              name="place"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Apartment Number",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (addressLine1Ref?.current) {
                    addressLine1Ref?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={addressLine1Ref}
              name="addressLineOne"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Address Line 1",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (addressLine2Ref?.current) {
                    addressLine2Ref?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={addressLine2Ref}
              name="addressLineTwo"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Address Line 2 (optional)",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (addressLine3Ref?.current) {
                    addressLine3Ref?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={addressLine3Ref}
              name="addressLineThree"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Address Line 3 (optional)",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (passCodeRef?.current) {
                    passCodeRef?.current.focus();
                  }
                },
              }}
            />
          </View>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={passCodeRef}
              name="passCode"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Postal Code",
                returnKeyType: "next",
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
                placeholder: "City",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (emailRef?.current) {
                    emailRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          {/* <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={countryRef}
              name="country"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: 'Country',
                returnKeyType: 'next',
                onSubmitEditing: () => {
                  if (passCodeRef?.current) {
                    passCodeRef?.current.focus();
                  }
                },
              }}
            />
          </View> */}
          <View
            style={{
              ...styles.textInput,
              marginLeft: hs(32),
              marginTop: vs(16),
            }}
          >
            <Nationality />
          </View>

          {/* create password */}
          <DismissKeyboardView>
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
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={emailRef}
              name="email"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Email",
                returnKeyType: "next",
                keyboardType: "email-address",
                onSubmitEditing: () => {
                  if (passwordRef?.current) {
                    passwordRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={passwordRef}
              name="password"
              inputProps={{
                password: true,
                ...textInputUnderlinedProps,
                placeholder: "Enter Password",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (confirmPasswordRef?.current) {
                    confirmPasswordRef?.current.focus();
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
                password: true,
                ...textInputUnderlinedProps,
                placeholder: "Re-enter Password",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (averageSinglePaymentRef?.current) {
                    averageSinglePaymentRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          {/* additional information */}
          <DismissKeyboardView>
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
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={averageSinglePaymentRef}
              name="averageSinglePayment"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Average Single Payment",
                returnKeyType: "done",
                keyboardType: "number-pad",
                onSubmitEditing: () => {
                  if (averagePerWeekPaymentRef?.current) {
                    averagePerWeekPaymentRef?.current.focus();
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
                placeholder: "Average Per Week Payment",
                returnKeyType: "done",
                keyboardType: "number-pad",
                onSubmitEditing: () => {
                  if (annualTrunoverRef?.current) {
                    annualTrunoverRef?.current.focus();
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
                placeholder: "Annual Turnover",
                returnKeyType: "done",
                keyboardType: "number-pad",
                onSubmitEditing: () => {
                  if (typicallyLagerPaymentRef?.current) {
                    typicallyLagerPaymentRef?.current.focus();
                  }
                },
              }}
            />
          </View>

          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              ref={typicallyLagerPaymentRef}
              name="typicallyLagerPayment"
              inputProps={{
                ...textInputUnderlinedProps,
                placeholder: "Typically Larger Payment",
                returnKeyType: "done",
                keyboardType: "number-pad",
              }}
            />
          </View>

          <View style={styles.button}>
            <Button
              btnTitle="Continue"
              loading={isLoading}
              disabled={
                !formik?.values?.registrationDate &&
                !formik?.values?.startedTradingDate
              }
              onClick={() => {
                // next?.();
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
export default Step1_Details;
