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
import { StyleSheet, Text } from "@src/components/libraries";
import { textInputDefaultProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";

import Logoicon from "@assets/eccLogo/one-tronix-logo.png";
import { useFormik } from "formik";
import { useRef } from "react";
import {
  Image,
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
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleBusinessSignup = async (values: any) => {
    Keyboard.dismiss();
    try {
      if (role) {
        const result = await signupInstaller({
          ...values,
          role: "68973f595f618352520c47f4",
        }).unwrap();
        next?.();
        // router.replace("/(main)/Business/Home");
        renderToastSuccess(result?.message);
      } else {
        const result = await signupBusiness({
          ...values,
          deviceId,
        }).unwrap();
        next?.();
        // router.replace("/(main)/Business/Home");
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
      <View
        style={{
          paddingHorizontal: hs(18),
          paddingVertical: hs(30),
          marginTop: Platform.OS === "ios" ? vs(10) : vs(10),
        }}
      >
        <TouchableOpacity onPress={() => router.replace("/(auth)/Signin")}>
          <Text
            style={{
              color: "white",
              fontSize: ms(16),
              marginTop: vs(10),
              fontFamily: "Ranade-Regular",
            }}
          >
            ← Back
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={Logoicon}
        style={{
          position: "absolute",
          width: 200,
          height: 240,
          alignSelf: "flex-end",
        }}
      />
      <View
        style={{
          alignItems: "flex-start",
          marginTop: vs(80),
          marginLeft: hs(15),
        }}
      >
        <Text
          style={{
            color: "red",

            fontSize: ms(40),
            lineHeight: 45,
            fontFamily: "Excon-Black",
          }}
        >
          ONE
        </Text>
        <Text
          style={{
            color: "red",
            fontSize: ms(44),
            fontFamily: "Excon-Regular",
            lineHeight: 45,
            marginTop: -4, // tighten spacing between ONE and TRONIX
          }}
        >
          TRONIX
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: ms(13),
            fontFamily: "Excon-Regular",
            letterSpacing: 1,
            lineHeight: 18,

            marginTop: -3, // small gap from TRONIX
          }}
        >
          TECHNOLOGY PARTNER
        </Text>
      </View>
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
        extraHeight={Platform.OS === "ios" ? getRespValue(300) : 180}
        viewIsInsideTabBar
        keyboardOpeningTime={0}
      >
        <View
          style={{
            flex: 1,
            paddingLeft: hs(16),
            paddingRight: hs(16),
            marginTop: vs(30),
            borderTopLeftRadius: ms(20),
            borderTopRightRadius: ms(20),
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              padding: 15,
              backgroundColor: "black",
              borderRadius: 20,
              width: "100%",
              alignSelf: "center",
            }}
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
                  fontFamily: "Excon-Regular",
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
                  className: "mt-2",
                  // fontFamily: "Excon-Regular",
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
                  // fontFamily: "Excon-Regular",
                  placeholder: "Enter last name",
                  keyboardType: "ascii-capable",
                  className: "mt-2",
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
                  // fontFamily: "Excon-Regular",
                  keyboardType: "email-address",
                  className: "mt-2",
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
                  contentStyle: {
                    paddingLeft: hs(16),
                    fontFamily: "Ranade-Regular",
                    fontSize: ms(14),
                  },
                  textContentType: "password",
                  placeholder: "Enter Password",
                  // fontFamily: "Excon-Regular",
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
                  contentStyle: {
                    paddingLeft: hs(16),
                    fontFamily: "Ranade-Regular",
                    fontSize: ms(14),
                  },
                  // fontFamily: "Excon-Regular",
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
                onClick={() => {
                  // next?.();
                  formik.handleSubmit();
                }}
              />
            </View>
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
        </View>
      </KeyboardAwareScrollView>
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
    width: "82%",
    alignSelf: "center",
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
