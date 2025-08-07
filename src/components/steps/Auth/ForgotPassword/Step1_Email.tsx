/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useForgotBusinessPasswordEmailMutation,
  useForgotBusinessPasswordPhoneMutation,
} from '@/store/api/business/authApis';
import TabButtons from '@src/components/commons/TabButton';
import { TabButton } from '@src/components/commons/TabButton/types';
import Button from '@src/components/globals/Button';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import DismissKeyboardView from '@src/components/globals/HideKeyboard';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputDefaultProps } from '@src/constants/Props';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm/types';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { hs, ms, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { View } from 'moti';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';

export enum SelectMethod {
  Email,
  PhoneNumber,
}
interface Step1_Probs extends MultiStepFormProps {
  setCheckData: (data: any) => void;
}
const Step1_Email = ({ next, setCheckData }: Step1_Probs) => {
  const [forgotBusinessEmailPassword, { isLoading }] =
    useForgotBusinessPasswordEmailMutation();
  const [forgotBusinessPhonePassword, { isLoading: phoneLoading }] =
    useForgotBusinessPasswordPhoneMutation();
  const [selectedTab, setSelectedTab] = useState<SelectMethod>(
    SelectMethod.Email,
  );
  const tabButtons: TabButton[] = [
    {
      title: 'Email',
      accessibilityLabel: 'Using Email',
    },
    {
      title: 'Phone',
      accessibilityLabel: 'Using Phone Number',
    },
  ];

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      email:
        selectedTab === 0
          ? Yup.string()
              .required('Email is required')
              .email('Invalid email address')
          : Yup.string().nullable(),
      phone:
        selectedTab === 1
          ? Yup.string().required('Phone number is required')
          : Yup.string().nullable(),
    }),
    onSubmit: async values => {
      const payloadEmail = {
        email: values.email,
      };
      const payloadPhone = {
        phoneNumber: `+44${values.phone}`,
      };
      if (selectedTab === 0) {
        try {
          const res = await forgotBusinessEmailPassword({
            ...payloadEmail,
          }).unwrap();
          if (next) {
            setCheckData({
              email: values.email,
              isphone: false,
            });
            next();
          }
          renderToastSuccess(res?.message || 'Successfully');
        } catch (error: any) {
          renderToastError(error?.data?.message || 'Something went wrong');
        }
      }
      if (selectedTab === 1) {
        try {
          const res = await forgotBusinessPhonePassword({
            ...payloadPhone,
          }).unwrap();
          if (next) {
            setCheckData({
              phone: `+44${values.phone}`,
              isphone: true,
            });
            next();
          }
          renderToastSuccess(res?.message || 'Successfully');
        } catch (error: any) {
          renderToastError(error?.data?.message || 'Something went wrong');
        }
      }
    },
  });

  return (
    <DismissKeyboardView>
      <ScreenAuth
        title="Forgot Password"
        topColor="transparent"
        bottomColor="transparent"
        darkStatus={false}
        appBarProps={{
          light: false,
          rightIcon: false,
        }}
        back={() => {
          if (router.canGoBack()) router.back();
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '90%',
              borderRadius: ms(15),
              overflow: 'hidden',
              marginTop: vs(5),
              marginBottom: vs(16),
            }}
          >
            <TabButtons
              buttons={tabButtons}
              disableRadious
              hideMarginLeft
              hideMarginRight
              selectedTab={selectedTab}
              setSelectedTab={index => {
                setSelectedTab(index);
                // if (index === 0) {
                //   setCheckData({
                //     isphone: false,
                //   });
                // } else {
                //   setCheckData({
                //     isphone: true,
                //   });
                // }
              }}
            />
          </View>
        </View>
        <View className="px-2">
          <Text
            style={styles.title}
            className="text-white ml-4 font-poppins-medium"
          >
            Forgot Password
          </Text>
          <Text
            style={styles.subtitle}
            className="text-[#D6D6D6] ml-4 font-poppins-medium"
          >
            {selectedTab === 0
              ? 'Please enter your business email to reset the\npassword.'
              : 'Please enter your business phone number to reset the password.'}
          </Text>

          {selectedTab === 0 ? (
            <View style={styles.textInput}>
              <FormikInput
                formik={formik}
                name="email"
                inputProps={{
                  placeholder: 'Enter email',
                  keyboardType: 'email-address',
                  ...textInputDefaultProps,
                }}
              />
            </View>
          ) : (
            <View style={styles.textInput}>
              <FormikPhoneInput
                formik={formik}
                name="phone"
                style={{
                  backgroundColor: '',
                  height: 100,
                }}
                inputProps={{
                  borderRadius: 15,
                  containerBackgroundColor:
                    Colors.light.theme.textInputBackgroundDark,
                  countryCodeColor: 'white',
                  inputColor: 'white',
                  backgroundColor: 'transparent',
                  returnKeyType: 'done',
                  keyboardType: 'phone-pad',
                  onChangePhoneNumber(e: any) {
                    // eslint-disable-next-line no-console
                    console.log('input: ', e);
                  },
                }}
              />
            </View>
          )}

          <View style={styles.button}>
            <Button
              btnTitle="Reset Password"
              loading={isLoading || phoneLoading}
              btnColor="rgba(128, 128, 128, 0.5)"
              onClick={() => {
                formik.handleSubmit();
              }}
            />
          </View>
        </View>
      </ScreenAuth>
    </DismissKeyboardView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: vs(56),
    fontSize: 20,
  },
  subtitle: {
    marginTop: vs(16),
    fontSize: 14,
  },
  textInput: {
    marginTop: vs(24),
    marginLeft: hs(16),
    marginRight: hs(16),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(16),
  },
});
export default Step1_Email;
