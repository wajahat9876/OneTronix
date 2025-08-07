/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import Button from '@src/components/globals/Button';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import Nationality from '@src/components/globals/Nationality';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { View } from 'react-native';
import * as Yup from 'yup';

const Step1_Enter_Details = ({ next }: MultiStepFormProps) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      dateOfBirth: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Username is required'),
      password: Yup.string()
        .min(8, 'password min length should be 8 characters')
        .required('Passwrod is required'),
    }),
    onSubmit: () => {},
  });
  return (
    <ScreenAuth
      title="Order Card"
      style={{
        backgroundColor: 'transparent',
      }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      appBarProps={{
        light: false,
      }}
      back={() => {
        if (router.canGoBack()) router.back();
      }}
    >
      <View style={{ ...globalStyle.mainTopCurvedCard, paddingTop: vs(42) }}>
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 17,
            marginLeft: hs(16),
            alignSelf: 'center',
          }}
        >
          Please fill out below fields
        </Text>
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
        <View style={[styles.textInput, { marginTop: vs(16) }]}>
          <FormikInput
            formik={formik}
            name="buildingNumber"
            inputProps={{
              ...textInputUnderlinedProps,
              placeholder: 'Apt, Door number, name',
            }}
          />
        </View>
        <View style={[styles.textInput, { marginTop: vs(16) }]}>
          <FormikInput
            formik={formik}
            name="streetName"
            inputProps={{
              ...textInputUnderlinedProps,
              placeholder: 'Street name',
            }}
          />
        </View>
        <View style={[styles.textInput, { marginTop: vs(16) }]}>
          <FormikInput
            formik={formik}
            name="postCode"
            inputProps={{
              ...textInputUnderlinedProps,
              placeholder: 'Post code',
            }}
          />
        </View>

        <View
          style={{
            ...styles.textInput,
            marginLeft: hs(32),
            marginTop: vs(16),
          }}
        >
          <Nationality />
        </View>

        <View style={[styles.textInput, { marginTop: vs(16) }]}>
          <FormikPhoneInput
            formik={formik}
            name="phoneInput"
            inputProps={{
              ...textInputUnderlinedProps,
              onChangePhoneNumber(e: any) {
                // eslint-disable-next-line no-console
                console.log('input: ', e);
              },
            }}
          />
        </View>
        <View style={{ ...globalStyle.buttonContinue, bottom: vs(24) }}>
          <Button
            btnTitle="Continue"
            onClick={() => {
              if (next) next?.();
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};
const styles = StyleSheet.create({
  textInput: {
    marginLeft: hs(32),
    marginRight: hs(16),
    marginTop: vs(8),
  },
});
export default Step1_Enter_Details;
