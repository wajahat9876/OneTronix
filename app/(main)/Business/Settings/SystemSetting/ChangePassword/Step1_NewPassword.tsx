import { useVerifyNewPasswordMutation } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import Button from "@src/components/globals/Button";
import FormikInput from "@src/components/globals/FormikInput";
import DismissKeyboardView from "@src/components/globals/HideKeyboard";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { StyleSheet } from "@src/components/libraries";
import { SettingProps } from "@src/components/steps/main/Business/Setting/type";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
// import { globalStyle } from '@src/styles/globals';
import { hs, vs } from "@utils/design/design";
import { useFormik } from "formik";
import { useRef } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import * as Yup from "yup";

const Step1_NewPassword = ({ parentGoto, back }: SettingProps) => {
  const { currentPassword } = useAppSelector(useBusinessDetails);
  const [verifyNewPassword, { isLoading }] = useVerifyNewPasswordMutation();
  const passwordRef = useRef<TextInput>(null);

  const handleVerifyPassword = async (values: any) => {
    try {
      const res = await verifyNewPassword({
        currentPassword: currentPassword,
        newPassword: values.password,
        confirmNewPassword: values.confirmPassword,
      }).unwrap();
      renderToastSuccess(res?.message);
      parentGoto?.(0);
    } catch (error: any) {
      renderToastError(error?.data?.message || "Something went wrong");
    }
  };
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
      handleVerifyPassword(values);
    },
  });
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_monessy"
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
    >
      <ScreenAuth
        title="Change Password"
        style={{
          backgroundColor: "#F9F9F9",
        }}
        topColor={"#F9F9F9"}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => {
          back?.();
        }}
      >
        <View style={styles.container}>
          <DismissKeyboardView>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Excon-Medium",
                alignSelf: "center",
                color: "black",
              }}
            >
              Verify New Password
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Excon-Regular",
                alignSelf: "center",
                color: "gray",
                marginTop: vs(20),
              }}
            >
              Please enter your new password to proceed.
            </Text>
            <View style={{ width: "90%" }}>
              <FormikInput
                formik={formik}
                name="password"
                ref={passwordRef}
                autoComplete="password"
                textContentType="password"
                inputProps={{
                  theme: {
                    fonts: { regular: { fontFamily: "Ranade-Regular" } },
                  },
                  height: vs(80),
                  textColor: "black",
                  fontFamily: "Ranade-Regular",
                  backgroundColor: "white",
                  cursorColor: "black",
                  selectionColor: "#D3D3D3",
                  placeholderTextColor: Colors.light.theme.placeholderColor,
                  textContentType: "password",
                  placeholder: "Enter Password",
                  className: "mt-10 ml-4",
                  returnKeyType: "done",
                  password: true,
                  autoComplete: "password",
                }}
              />
            </View>
            <View style={{ width: "90%" }}>
              <FormikInput
                formik={formik}
                name="confirmPassword"
                ref={passwordRef}
                autoComplete="password"
                textContentType="password"
                inputProps={{
                  theme: {
                    fonts: { regular: { fontFamily: "Ranade-Regular" } },
                  },
                  height: vs(80),
                  textColor: "black",
                  fontFamily: "Ranade-Regular",
                  backgroundColor: "white",
                  cursorColor: "black",
                  selectionColor: "#D3D3D3",
                  placeholderTextColor: Colors.light.theme.placeholderColor,
                  textContentType: "password",
                  placeholder: "Confirm Password",
                  className: "mt-2 ml-4",
                  returnKeyType: "done",
                  password: true,
                  autoComplete: "password",
                }}
              />
            </View>
          </DismissKeyboardView>
          <View style={{ width: "80%", alignSelf: "center", marginBottom: 20 }}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              btnTitle="Continue"
              btnColor="#f41a2c"
              btnTitleColor="white"
              onClick={() => {
                formik.submitForm();
              }}
            />
          </View>
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: hs(16),
    marginTop: vs(24),
  },
  card: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 2,
  },
});
export default Step1_NewPassword;
