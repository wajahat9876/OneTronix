/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useResetBusinessPasswordMutation } from '@/store/api/business/authApis';
import Button from '@src/components/globals/Button';
import FormikInput from '@src/components/globals/FormikInput';
import DismissKeyboardView from '@src/components/globals/HideKeyboard';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { textInputDefaultProps } from '@src/constants/Props';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm/types';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { hs, vs } from '@utils/design/design';
import { useFormik } from 'formik';
import { StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';

interface Step3_Probs extends MultiStepFormProps {
  setCheckData: (data: any) => void;
  checkData: any;
}
const Step3_NewPassword = ({
  next,
  goTo,
  setCheckData,
  checkData,
}: Step3_Probs) => {
  const [resetBusinessPassword, { isLoading }] =
    useResetBusinessPasswordMutation();

  const handleBusinessSubmit = async (values: any) => {
    if (checkData?.isphone === true) {
      try {
        const verifyForogtData = {
          ...values,
          phoneNumber: checkData?.phone,
        };
        const res = await resetBusinessPassword(verifyForogtData).unwrap();
        renderToastSuccess(res?.message || 'Success');
        if (next) next();
      } catch (error: any) {
        renderToastError(error?.data?.message || 'Something went wrong');
      }
    }
    if (checkData?.isphone === false) {
      try {
        const verifyForogtData = {
          ...values,
          email: checkData?.email,
        };
        const res = await resetBusinessPassword(verifyForogtData).unwrap();
        renderToastSuccess(res?.message || 'Success');
        if (next) next();
      } catch (error: any) {
        renderToastError(error?.data?.message || 'Something went wrong');
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string().required('Confirm Password is required'),
    }),

    onSubmit: async values => {
      setTimeout(() => {
        handleBusinessSubmit(values);
      }, 500);

      // try {
      //   const res = await resetBusinessPassword({
      //     ...values,
      //   }).unwrap();
      //   next?.();
      //   renderToastSuccess(res?.message || 'Success');
      // } catch (error: any) {
      //   renderToastError(error?.data?.message || 'Something went wrong');
      // }
    },
  });

  return (
    <DismissKeyboardView>
      <ScreenAuth
        title=""
        topColor="transparent"
        bottomColor="transparent"
        darkStatus={false}
        appBarProps={{
          light: false,
          rightIcon: false,
        }}
        back={() => {
          if (goTo) {
            goTo?.(0);
            setCheckData({
              isphone: false,
              phone: '',
              email: '',
            });
          }
        }}
      >
        <View className="px-2">
          <Text
            style={styles.title}
            className="text-white ml-4 font-poppins-medium"
          >
            Set new password
          </Text>
          <Text
            style={styles.subtitle}
            className="text-[#D6D6D6] ml-4 font-poppins-medium"
          >
            {
              'Create a new password. Ensure it differs\nfrom previous ones for security'
            }
          </Text>
          <View style={styles.textInput}>
            <FormikInput
              formik={formik}
              name="password"
              inputProps={{
                ...textInputDefaultProps,
                placeholderTextColor: 'white',
                placeholder: 'Enter your new password',
                password: true,
                returnKeyType: 'next',
              }}
            />
            <FormikInput
              formik={formik}
              name="confirmPassword"
              inputProps={{
                ...textInputDefaultProps,
                placeholderTextColor: 'white',
                placeholder: 'Re-enter your password',
                password: true,
                returnKeyType: 'done',
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              btnTitle="Update Password"
              btnColor="rgba(128, 128, 128, 0.5)"
              loading={isLoading}
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
  title: {
    marginTop: vs(24),
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
    gap: vs(16),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(16),
  },
});
export default Step3_NewPassword;
