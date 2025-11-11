/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { useBusinessSigninMutation } from "@/store/api/business/authApis";
import { setRole } from "@/store/slices/business/businessSlice";
import Logo from "@assets/eccLogo/oneTronixLogo.svg";
import BottomSheet from "@gorhom/bottom-sheet";
import Button from "@src/components/globals/Button";
import FormikInput from "@src/components/globals/FormikInput";
import { Text, TouchableOpacity } from "@src/components/libraries";
import { textInputDefaultProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useMemo, useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

const Step1_BasicDetails = ({ next }: MultiStepFormProps) => {
  const [businessSignIn, { isLoading: isBusinessSignInLoading }] =
    useBusinessSigninMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isActive, setActive] = useState(false);
  const handleBusinessSignIn = async (values: any) => {
    try {
      const result = await businessSignIn(values).unwrap();
      // dispatch(setSigninBusinessEmail(values?.email));
      console.log("SignIn Result", result);
      if (result?.results?.user?.isVerified === true) {
        router.replace("/(main)/Business/Home");
      } else next?.();
      renderToastSuccess(result.message);
    } catch (error: any) {
      console.log(error, "error");
      renderToastError(error?.data?.message || "Something went wrong");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      const userCredentials = {
        ...values,
      };
      handleBusinessSignIn(userCredentials);
    },
  });

  // refsuseRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const closeBottomSheet = () => {
    setActive(false);
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openBottomSheet = () => {
    setActive(true);
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };
  const snapPoints = useMemo(() => ["100%"], []);
  const [, setBottomSheetVisible] = useState(false);
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? getRespValue(10) : 10,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        enableAutomaticScroll
        scrollEnabled
        extraHeight={Platform.OS === "ios" ? getRespValue(250) : 80}
        viewIsInsideTabBar
        keyboardOpeningTime={0}
      >
        <View
          className="w-full justify-start flex-1"
          style={{
            paddingHorizontal: hs(16),
          }}
        >
          <View
            style={{
              alignSelf: "flex-end",
              padding: hs(15),
              marginRight: -6,
              marginTop: Platform.OS === "ios" ? vs(10) : vs(15),
            }}
          >
            <Logo />
          </View>
          <View
            style={{
              alignItems: "flex-start",
              marginTop: vs(32),
            }}
          >
            <Text
              style={{
                color: "red",
                // fontWeight: "900",
                fontSize: ms(40),
                lineHeight: 45,
                fontFamily: "Excon-Medium",
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
                marginBottom: vs(100),
                marginTop: -5, // small gap from TRONIX
              }}
            >
              TECHNOLOGY PARTNER
            </Text>
          </View>
          <View
            style={{
              padding: 15,
              backgroundColor: "black",
              borderRadius: 20,
              width: "95%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: ms(24),
                marginTop: vs(10),
                textAlign: "center",
                fontFamily: "Excon-Medium",
              }}
              className="text-white font-poppins-semibold"
            >
              Welcome!
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
              Sign in to your account
            </Text>
            <Text
              style={{
                fontSize: ms(16),
                alignSelf: "flex-start",
                marginLeft: hs(10),
                fontFamily: "Excon-Regular",
              }}
              className="text-white font-poppins"
            >
              Email
            </Text>
            <FormikInput
              formik={formik}
              name="email"
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
            <Text
              style={{
                fontSize: ms(16),
                alignSelf: "flex-start",
                marginTop: vs(16),
                marginLeft: hs(10),
                fontFamily: "Excon-Regular",
              }}
              className="text-white font-poppins"
            >
              Password
            </Text>
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
              }}
            />

            <View
              style={{
                alignSelf: "flex-end",
                marginTop: vs(5),
                marginBottom: vs(35),
              }}
            >
              {/* <Link href="/(auth)/Signup/Business" asChild> */}

              {/* </Link> */}
              <TouchableOpacity
                onPress={() => {
                  // router.push("/(auth)/Signup");
                }}
              >
                <Text
                  style={{ fontSize: 13, fontFamily: "Excon-Regular" }}
                  className="text-white "
                >
                  Forgot Password
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <Button
                btnTitle="Log In"
                disabled={isBusinessSignInLoading}
                loading={isBusinessSignInLoading}
                btnColor="#F4192C"
                btnTitleColor="white"
                onClick={() => {
                  formik.submitForm();
                }}
              />
            </View>
          </View>
        </View>
        <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
          {/* Button and Scan in a Row */}

          {/* <TouchableOpacity onPress={() => openBottomSheet()}>
              <Image
                source={WhiteOutline}
                style={{ height: 25, width: 25, marginLeft: 10 }}
              />
            </TouchableOpacity> */}

          {/* Text below row */}
          <View style={{ flexDirection: "row", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 12,
                color: "white",

                marginTop: 5, // Adds consistent space
                fontFamily: "Excon-Regular",
              }}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setRole(true)), router.push("/(auth)/Signup");
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "red",
                  marginTop: 6, // Adds consistent space
                  fontFamily: "Excon-Regular",
                }}
              >
                {" "}
                Create an Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <Step2ScanQr
          snapPoints={snapPoints}
          bottomSheetRef={bottomSheetRef}
          key="dssa"
          closeBottomSheet={closeBottomSheet}
          active={isActive}
        /> */}
      </KeyboardAwareScrollView>
    </>
  );
};
export default Step1_BasicDetails;
