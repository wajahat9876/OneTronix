/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useBusinessSelectMainApplicantMutation,
  useGetAllDirectorQuery,
} from '@/store/api/business/authApis';
import Button from '@src/components/globals/Button';
import FormikDropdownRNE from '@src/components/globals/DropdownRNE/FormikDropdownRNE';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { Text, TouchableOpacity } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import * as Yup from 'yup';

const Step5_Select_Main_Applicant = ({ next }: MultiStepFormProps) => {
  const {
    data: allDirectorsData,
    isSuccess: isAllDirectors,
    isLoading: isAllDirectorsLoading,
    isFetching: isAllDirectorsFetching,
    isError,
  } = useGetAllDirectorQuery({ type: 'directors' });

  const [addMainApplicant, { isLoading: isAddingApplicantLoading }] =
    useBusinessSelectMainApplicantMutation();
  const { handleBusinessLogout } = useBusinessLogout();
  const formik = useFormik({
    initialValues: {
      mainApplicant: '',
    },
    validationSchema: Yup.object({
      mainApplicant: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      const selectedDirector = allDirectorsData?.data.find(
        director => director.email === values.mainApplicant,
      );

      if (selectedDirector) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { address, ...directorDetailsWithoutAddress } = selectedDirector;
        handleMainApplicantSelection(directorDetailsWithoutAddress);
      } else {
        renderToastError('Please select Main Applicant first');
      }
    },
  });

  const directorsData = useMemo(() => {
    return allDirectorsData?.data.map(director => ({
      label: `${
        director.firstName
          ? ` ${director.firstName} ${director?.surname ?? ''}`
          : ` ${director.name}`
      }`,
      value: director.email,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDirectorsData]);

  const handleMainApplicantSelection = async (values: any) => {
    try {
      const result = await addMainApplicant(values).unwrap();
      if (result) {
        renderToastSuccess(result.message);
        if (next) next?.();
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };

  return (
    <ScreenAuth
      title="Main Applicant"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        handleBusinessLogout();
      }}
    >
      <View style={globalStyle.authTopCurvedCard}>
        <SignupStepsHeader
          colorStepOne={Colors.light.theme.signupStepDoneBackground}
          colorStepTwo={Colors.light.theme.signupStepInProgressBackground}
          colorStepThree={Colors.light.theme.singupStepRemainingBackgroud}
          titleStepOne="Terms & Policy"
          titleStepTwo="Details"
          titleStepThree="Verify ID"
          iconStepOne={<IconStepDone />}
          iconStepTwo={<IconStepInProgress />}
          iconStepThree={<IconStepRemaining />}
        />
        <TouchableOpacity
          onPress={() => {
            next?.();
          }}
        >
          <Text>Next</Text>
        </TouchableOpacity>
        {!isAllDirectorsLoading ||
          (!isAllDirectorsFetching && (
            <View className="flex-1 justify-center">
              <ActivityIndicator
                size="large"
                color={Colors.light.theme.primaryColor}
              />
            </View>
          ))}

        {isError && (
          <View className="flex-1 justify-center items-center">
            <Text style={globalStyle.textMedium}>
              {allDirectorsData?.message}
            </Text>
          </View>
        )}

        {isAllDirectors && allDirectorsData && (
          <View className="flex-1">
            <Text
              style={{
                ...globalStyle.textMedium,
                marginTop: vs(32),
                marginLeft: hs(16),
              }}
            >
              Choose Main Applicant
            </Text>

            <Text
              style={{
                ...globalStyle.textRegular,
                marginTop: vs(8),
                marginLeft: hs(16),
              }}
            >
              Please choose main applicant in the dropdown below.
            </Text>

            {/* <View
              style={{
                marginLeft: hs(16),
                marginRight: hs(16),
                marginTop: vs(32),
              }}
            >
              <FormikDropDown
                formik={formik}
                name="mainApplicant"
                placeHolderText="Main Applicant"
                data={directorsData || []}
                optionsListStyle={{ backgroundColor: 'red' }}
              />
            </View> */}
            <View
              style={{
                marginLeft: hs(16),
                marginRight: hs(16),
                marginTop: vs(32),
              }}
            >
              <FormikDropdownRNE
                formik={formik}
                name="mainApplicant"
                placeholder="Main Applicant"
                data={directorsData || []}
                value={formik?.values?.mainApplicant}
                dropdownType="sm"
                labelField="label"
                valueField="value"
                dropdownPosition="bottom"
              />
            </View>
            <View style={globalStyle.buttonContinue}>
              <Button
                btnTitle="Continue"
                loading={isAddingApplicantLoading}
                onClick={() => {
                  formik.handleSubmit();
                }}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenAuth>
  );
};

export default Step5_Select_Main_Applicant;
