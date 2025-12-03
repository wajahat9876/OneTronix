/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { useResetPasswordMutation } from "@/store/api/business/authApis";
import { resetBusinessTempToken } from "@/store/slices/business/businessSlice";
import Logoicon from "@assets/eccLogo/one-tronix-logo.png";
import Button from "@src/components/globals/Button";
import FormikInput from "@src/components/globals/FormikInput";
import LoadingModal from "@src/components/globals/LoadingModal";
import { StyleSheet, Text } from "@src/components/libraries";
import { textInputDefaultProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useCallback, useRef } from "react";
import {
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as Yup from "yup";

const Step2_ResetPassword = ({ back, next, goTo }: MultiStepFormProps) => {
  const dispatch = useAppDispatch();
  const [resetPassword, { isLoading: businessLoading }] =
    useResetPasswordMutation();
  const router = useRouter();
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleverify = useCallback(async (values: any) => {
    try {
      const result = await resetPassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap();
      dispatch(resetBusinessTempToken());
      router.replace("/(auth)/Signin");
      renderToastSuccess(result.message);
    } catch (error: any) {
      renderToastError(error.data.message);
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values?.password);
      handleverify(values);
    },
  });
  const handleBack = () => {
    dispatch(resetBusinessTempToken());
    goTo?.(0);
  };
  return (
    <>
      <View
        style={{
          paddingHorizontal: hs(10),
          paddingVertical: hs(30),
          marginTop: Platform.OS === "ios" ? vs(10) : vs(15),
        }}
      >
        <TouchableOpacity onPress={() => handleBack()}>
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
          marginLeft: hs(15),
          marginTop: vs(80),
        }}
      >
        <Text
          style={{
            color: "red",
            fontSize: ms(44),
            fontFamily: "Excon-Black",
            lineHeight: 45,
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
          paddingBottom: Platform.OS === "ios" ? vs(10) : vs(0),
        }}
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true} // ⬅️ user can manually scroll
      >
        <View style={styles.container}>
          <Text style={styles.title} className="text-white ">
            Enter New Password
          </Text>
          <View
            style={{ width: "90%", alignSelf: "center", marginTop: vs(20) }}
          >
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
                height: vs(70),
                fontFamily: "Ranade-Regular",
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
          <View
            style={{ width: "90%", alignSelf: "center", marginTop: vs(20) }}
          >
            <FormikInput
              formik={formik}
              name="confirmPassword"
              ref={confirmPasswordRef}
              autoComplete="password"
              textContentType="password"
              inputProps={{
                ...textInputDefaultProps,
                textContentType: "password",
                height: vs(70),
                fontFamily: "Ranade-Regular",
                placeholder: "Confirm Password",
                className: "mt-2",
                returnKeyType: "done",
                password: true,
                autoComplete: "password",
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View
        style={{
          width: "80%",
          alignSelf: "center",
          position: "absolute",
          bottom: 20,
        }}
      >
        <Button
          btnTitle="Continue"
          disabled={businessLoading}
          btnColor="#F4192C"
          btnTitleColor="white"
          onClick={() => {
            formik.submitForm();
          }}
        />
      </View>
      <LoadingModal isLoading={businessLoading} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: vs(22),
    paddingHorizontal: hs(8),
    marginTop: vs(60),
  },
  title: {
    fontSize: ms(24),
    fontFamily: "Excon-Medium",
    alignSelf: "center",
  },
  subtitle: {
    marginTop: vs(16),
    fontSize: ms(12),
    fontFamily: "Ranade-Thin",
    alignSelf: "center",
    width: "60%",
  },
});
export default Step2_ResetPassword;
