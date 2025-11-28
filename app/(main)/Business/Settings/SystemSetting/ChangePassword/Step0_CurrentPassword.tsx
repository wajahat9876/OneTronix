import { useVerifyCurrentPasswordMutation } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import { setCurrentPassword } from "@/store/slices/business/businessSlice";
import Button from "@src/components/globals/Button";
import FormikInput from "@src/components/globals/FormikInput";
import DismissKeyboardView from "@src/components/globals/HideKeyboard";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { StyleSheet } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
// import { globalStyle } from '@src/styles/globals';
import { hs, vs } from "@utils/design/design";
import { useFormik } from "formik";
import { useRef } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import * as Yup from "yup";

const Step0_CurrentPassword = ({ goTo, next }: MultiStepFormProps) => {
  const { data } = useAppSelector(useBusinessDetails);
  const dispatch = useAppDispatch();
  const passwordRef = useRef<TextInput>(null);
  const [verifyCurrentPassword, { isLoading }] =
    useVerifyCurrentPasswordMutation();

  const handleSubmit = async (values: any) => {
    try {
      const res = await verifyCurrentPassword({
        currentPassword: values.currentPassword,
      }).unwrap();
      renderToastSuccess(res?.message);
      next?.();
      dispatch(setCurrentPassword(values.currentPassword));
    } catch (error: any) {
      renderToastError(error?.data?.message || "Something went wrong");
    }
  };
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
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
          goTo?.(0);
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
              Verify Current Password
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
              Please enter your current password to proceed.
            </Text>
            <FormikInput
              formik={formik}
              name="currentPassword"
              ref={passwordRef}
              autoComplete="password"
              textContentType="password"
              inputProps={{
                width: "90%",
                height: vs(80),
                textColor: "black",
                fontFamily: "Excon-Regular",
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
          </DismissKeyboardView>
          <View style={{ width: "80%", alignSelf: "center", marginBottom: 20 }}>
            <Button
              loading={isLoading}
              disabled={!formik.isValid || isLoading}
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
export default Step0_CurrentPassword;
