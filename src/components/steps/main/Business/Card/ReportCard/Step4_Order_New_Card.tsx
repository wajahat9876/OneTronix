/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import Button from '@src/components/globals/Button';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import Nationality from '@src/components/globals/Nationality';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useFormik } from 'formik';
import { View } from 'react-native';
import * as Yup from 'yup';

const Step4_Order_New_Card = ({ next, back }: MultiStepFormProps) => {
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
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
      }}
      back={() => {
        if (back) back?.();
      }}
    >
      <View className="flex-1 mt-4 pr-4 pl-4">
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 17,
            marginLeft: hs(16),
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
              type: 'underlined',
              placeholder: 'Apt, Door number, name',
              backgroundColor: 'transparent',
              selectionColor: 'black',
              borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
              placeholderTextColor: Colors.light.theme.placeholderColor,
              borderBottomHeight: 1.5,
            }}
          />
        </View>
        <View style={[styles.textInput, { marginTop: vs(16) }]}>
          <FormikInput
            formik={formik}
            name="streetName"
            inputProps={{
              type: 'underlined',
              placeholder: 'Street name',
              backgroundColor: 'transparent',
              selectionColor: 'black',
              borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
              placeholderTextColor: Colors.light.theme.placeholderColor,
              borderBottomHeight: 1.5,
            }}
          />
        </View>
        <View style={[styles.textInput, { marginTop: vs(16) }]}>
          <FormikInput
            formik={formik}
            name="postCode"
            inputProps={{
              type: 'underlined',
              placeholder: 'Post code',
              backgroundColor: 'transparent',
              selectionColor: 'black',
              borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
              placeholderTextColor: Colors.light.theme.placeholderColor,
              borderBottomHeight: 1.5,
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
              backgroundColor: 'transparent',
              selectionColor: 'black',
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
  dividerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: hs(16),
    marginRight: hs(16),
  },
  divider: {
    height: 1,
    width: '30%',
    marginLeft: hs(8),
    marginRight: hs(8),
    backgroundColor: '#0000003B',
  },
  dividerText: {
    color: '#0000003B',
    fontSize: 14,
    fontFamily: 'poppins',
  },
  textInput: {
    marginLeft: hs(32),
    marginRight: hs(16),
    marginTop: vs(8),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: hs(32),
    marginTop: vs(32),
    marginBottom: vs(32),
    marginLeft: hs(32),
    marginRight: hs(16),
  },
});
export default Step4_Order_New_Card;
