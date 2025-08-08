/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { useBusinessSigninMutation } from "@/store/api/business/authApis";
import Logo from "@assets/eccLogo/ecc 1.svg";
import WhiteOutline from "@assets/icons/user/qr/whiteOutline.png";
import BottomSheet from "@gorhom/bottom-sheet";
import Button from "@src/components/globals/Button";
import FormikInput from "@src/components/globals/FormikInput";
import { Text, TouchableOpacity } from "@src/components/libraries";
import Step2ScanQr from "@src/components/steps/Qr";
import { textInputDefaultProps } from "@src/constants/Props";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm/types";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { globalStyle } from "@src/styles/globals";
import { hs, vs } from "@utils/design/design";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useMemo, useRef, useState } from "react";
import { Image, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
      if (result) {
        renderToastSuccess(result.message);
        router.replace("/(main)/Business/Home");
        // if (next) next?.();
      }
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

  // refs
  const passwordRef = useRef() as React.MutableRefObject<TextInput>;
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
    <KeyboardAwareScrollView
      bottomOffset={100}
      style={{
        flex: 1,
      }}
      scrollEnabled={false}
      contentContainerStyle={{
        justifyContent: "center",
        paddingTop: vs(0),
        flexGrow: 1,
      }}
    >
      <View
        className="w-full justify-start items-center"
        style={{
          paddingHorizontal: hs(16),
        }}
      >
        <View style={{ marginBottom: vs(24) }}>
          <Logo />
        </View>

        <TouchableOpacity onPress={() => openBottomSheet()}>
          <Image source={WhiteOutline} style={{ height: 25, width: 25 }} />
        </TouchableOpacity>

        <Text
          style={{ fontSize: 18, marginTop: vs(32) }}
          className="text-white font-poppins-medium"
        >
          Welcome!
        </Text>
        <Text
          style={{
            fontSize: 15,
            alignSelf: "flex-start",
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
            placeholder: "Email",
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
            fontSize: 15,
            alignSelf: "flex-start",
            marginTop: vs(16),
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
            placeholder: "Password",
            className: "mt-2",
            returnKeyType: "done",
            password: true,
            autoComplete: "password",
          }}
        />
        <View className="flex-row justify-between w-full mt-4 px-2">
          {/* <Link href="/(auth)/Signup/Business" asChild> */}
          <Text style={{ fontSize: 13 }} className="text-white font-poppins">
            Don't have an account?{" "}
          </Text>
          {/* </Link> */}
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/Signup");
            }}
          >
            <Text style={{ fontSize: 13 }} className="text-white font-poppins">
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={globalStyle.buttonContinue}>
        <Button
          btnTitle="Sign In"
          disabled={isBusinessSignInLoading}
          loading={isBusinessSignInLoading}
          btnColor="rgba(128, 128, 128, 0.5)"
          btnTitleColor="white"
          onClick={() => {
            formik.submitForm();
          }}
        />
      </View>
      <Step2ScanQr
        snapPoints={snapPoints}
        bottomSheetRef={bottomSheetRef}
        key="dssa"
        closeBottomSheet={closeBottomSheet}
        active={isActive}
      />
    </KeyboardAwareScrollView>
  );
};
export default Step1_BasicDetails;
