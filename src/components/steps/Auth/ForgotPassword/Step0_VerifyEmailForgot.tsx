/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { useForgotPasswordEmailMutation } from "@/store/api/business/authApis";
import { resetBusinessTempToken } from "@/store/slices/business/businessSlice";
import Logo from "@assets/eccLogo/oneTronixLogo.svg";
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
import { useCallback } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

const Step0_VerifyEmail = ({ back, next }: MultiStepFormProps) => {
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading: businessLoading }] =
    useForgotPasswordEmailMutation();
  const router = useRouter();

  const handleverify = useCallback(async (email: string) => {
    try {
      const result = await forgotPassword({ email }).unwrap();
      next?.();
      renderToastSuccess(result.message);
    } catch (error: any) {
      renderToastError(error.data.message);
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      handleverify(values?.email);
    },
  });
  const handleBack = () => {
    dispatch(resetBusinessTempToken());
    router.replace("/(auth)/Signin");
  };
  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            <Logo />
          </View>
        </View>
        <View
          style={{
            marginLeft: 12,
            marginTop: vs(8),
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
              marginTop: -5, // small gap from TRONIX
            }}
          >
            TECHNOLOGY PARTNER
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.title} className="text-white ">
            Verify Email
          </Text>
          <View
            style={{ width: "90%", alignSelf: "center", marginTop: vs(20) }}
          >
            <FormikInput
              formik={formik}
              name="email"
              autoComplete="username"
              textContentType="username"
              inputProps={{
                ...textInputDefaultProps,
                height: vs(70),
                textContentType: "username",
                autoComplete: "username",
                placeholder: "Enter Email",
                keyboardType: "email-address",
                className: "mt-4",
                returnKeyType: "next",
                onSubmitEditing: () => {},
              }}
            />
          </View>
        </View>
      </ScrollView>
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
export default Step0_VerifyEmail;
