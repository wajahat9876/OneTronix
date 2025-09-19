/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useBusinessManualSignupMutation,
  useBusinessSignupInstallerMutation,
} from "@/store/api/business/authApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import { setRole } from "@/store/slices/business/businessSlice";
import Button from "@src/components/globals/Button";
import FormikInput from "@src/components/globals/FormikInput";
import DismissKeyboardView from "@src/components/globals/HideKeyboard";
import OneTronixBrand from "@src/components/globals/OneTronixBrand";
import { StyleSheet, Text } from "@src/components/libraries";
import { textInputDefaultProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";

import { useFormik } from "formik";
import { useRef } from "react";
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

const Step1_Details = ({ back, next }: MultiStepFormProps) => {
  const dispatch = useAppDispatch();
  const { deviceId, role } = useAppSelector(useBusinessDetails);
  const [signupBusiness, { isLoading }] = useBusinessManualSignupMutation();
  const [signupInstaller, { isLoading: isLoadingInstaller }] =
    useBusinessSignupInstallerMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
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
    }),
    onSubmit: (values) => {
      console.log("presses", values);
      handleBusinessSignup(values);
    },
  });
  const firstNameRef = useRef() as React.MutableRefObject<TextInput>;
  const lastNameRef = useRef() as React.MutableRefObject<TextInput>;
  const emailRef = useRef() as React.MutableRefObject<TextInput>;
  const passwordRef = useRef() as React.MutableRefObject<TextInput>;
  const confirmPasswordRef = useRef() as React.MutableRefObject<TextInput>;

  const handleBusinessSignup = async (values: any) => {
    Keyboard.dismiss();
    try {
      if (role) {
        const result = await signupInstaller({
          ...values,
          role: "68973f595f618352520c47f4",
        }).unwrap();
        router.replace("/(main)/Business/Home");
        renderToastSuccess(result?.message);
      } else {
        const result = await signupBusiness({
          ...values,
          deviceId,
        }).unwrap();

        router.replace("/(main)/Business/Home");
        renderToastSuccess(result?.message);
      }
    } catch (error: any) {
      console.log(error, "error");
      renderToastError(error?.data?.message || "Something went wrong");
    }
  };

  console.log(role, "Role");

  return (
    <>
      <OneTronixBrand align="right" />
      <View
        style={{
          flex: 1,
          paddingLeft: hs(16),
          paddingRight: hs(16),
          paddingTop: vs(16),
          borderTopLeftRadius: ms(20),
          borderTopRightRadius: ms(20),
          backgroundColor: "transparent",
        }}
      >
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
                fontSize: ms(24),
                marginTop: vs(20),
                textAlign: "center",
                fontFamily: "Excon-Medium",
              }}
              className="text-white font-poppins-semibold"
            >
              Create an Account
            </Text>
            <Text
              style={{
                fontSize: ms(13),
                textAlign: "center",
                color: "gray",
              }}
              className="text-white font-extralight"
            >
              Enter details to register
            </Text>
          </DismissKeyboardView>
          <DismissKeyboardView>
            <Text style={styles.labelTxt}>First Name</Text>
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              name="firstName"
              ref={firstNameRef}
              inputProps={{
                ...textInputDefaultProps,
                placeholder: "Enter first name",
                keyboardType: "ascii-capable",
                className: "mt-4",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (lastNameRef?.current) {
                    lastNameRef.current.focus();
                  }
                },
              }}
            />
          </View>
          <DismissKeyboardView>
            <Text style={styles.labelTxt}>Last Name</Text>
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              name="lastName"
              ref={lastNameRef}
              inputProps={{
                ...textInputDefaultProps,

                placeholder: "Enter last name",
                keyboardType: "ascii-capable",
                className: "mt-4",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (emailRef?.current) {
                    emailRef.current.focus();
                  }
                },
              }}
            />
          </View>
          {/* create password */}
          <DismissKeyboardView>
            <Text style={styles.labelTxt}>Email</Text>
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              name="email"
              ref={emailRef}
              autoComplete="username"
              textContentType="username"
              inputProps={{
                ...textInputDefaultProps,
                textContentType: "username",
                autoComplete: "username",
                placeholder: "Enter Email",
                keyboardType: "email-address",
                className: "mt-4",
                returnKeyType: "next",
                onSubmitEditing: () => {
                  if (passwordRef?.current) {
                    passwordRef.current.focus();
                  }
                },
              }}
            />
          </View>
          <DismissKeyboardView>
            <Text style={styles.labelTxt}>Password</Text>
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              name="password"
              ref={passwordRef}
              autoComplete="password"
              textContentType="password"
              inputProps={{
                ...textInputDefaultProps,
                textContentType: "password",
                placeholder: "Enter Password",
                className: "mt-2",
                returnKeyType: "done",
                password: true,
                autoComplete: "password",
                onSubmitEditing: () => {
                  if (confirmPasswordRef?.current) {
                    confirmPasswordRef.current.focus();
                  }
                },
              }}
            />
          </View>
          <DismissKeyboardView>
            <Text style={styles.labelTxt}>Confirm Password</Text>
          </DismissKeyboardView>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              name="confirmPassword"
              ref={confirmPasswordRef}
              inputProps={{
                ...textInputDefaultProps,

                placeholder: "Re-enter Password",
                className: "mt-2",
                returnKeyType: "done",
                password: true,
              }}
            />
          </View>

          <View style={styles.button}>
            <Button
              btnTitle="Continue"
              btnColor="#F41A2C"
              btnTitleColor="white"
              loading={isLoading || isLoadingInstaller}
              // disabled={
              //   !formik?.values?.password ||
              //   !formik?.values?.email ||
              //   !formik?.values?.confirmPassword
              // }
              onClick={() => {
                // next?.();
                formik.handleSubmit();
              }}
            />
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Text
              style={{
                fontSize: ms(12),
                color: "white",
                fontFamily: "Excon-Regular",
              }}
            >
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setRole(false));
                router.push("/(auth)/Signin");
              }}
            >
              <Text
                style={{
                  fontSize: ms(12),
                  color: "red",
                  fontFamily: "Excon-Regular",
                }}
              >
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  textInput: {
    marginLeft: hs(32),
    marginRight: hs(16),
    // marginTop: vs(16),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(8),
    marginBottom: vs(12),
  },
  labelTxt: {
    fontSize: ms(16),
    alignSelf: "flex-start",
    marginLeft: hs(40),
    marginTop: vs(10),
    fontFamily: "Excon-Regular",
    color: "white",
  },
});
export default Step1_Details;
