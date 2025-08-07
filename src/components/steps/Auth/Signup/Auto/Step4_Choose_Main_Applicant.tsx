/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useBusinessSelectMainApplicantMutation,
  useBusinessUpdateMainApplicantMutation,
  useGetAllDirectorQuery,
} from '@/store/api/business/authApis';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '@src/components/globals/Button';
import FormikDropdownRNE from '@src/components/globals/DropdownRNE/FormikDropdownRNE';
import FormikDatePicker from '@src/components/globals/FormikDatePicker';
import FormikInput from '@src/components/globals/FormikInput';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import moment from 'moment';
import { useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator } from 'react-native-paper';
import * as Yup from 'yup';

const Step4_Choose_Main_Applicant = ({ back }: MultiStepFormProps) => {
  const router = useRouter();
  const [selectMainApplicant, { isLoading: isSelectMainApplicantLoading }] =
    useBusinessSelectMainApplicantMutation();
  const [updateMainApplicant, { isLoading: updateLoading }] =
    useBusinessUpdateMainApplicantMutation();
  const [peopleId, setPeopleId] = useState('');
  const { handleBusinessLogout } = useBusinessLogout();
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const {
    data: allDirectorsData,
    isSuccess: isAllDirectors,
    isLoading: isAllDirectorsLoading,
    isFetching: isAllDirectorsFetching,
    isError,
  } = useGetAllDirectorQuery({ type: '1' });

  const handleSelectMainApplicant = async (mainApplicantId: string) => {
    try {
      const mainApplicantPayload = {
        peopleId: mainApplicantId,
      };
      const result = await selectMainApplicant(mainApplicantPayload).unwrap();
      if (result) {
        renderToastSuccess(result?.message);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
      const errorMessage = error?.data?.message;
      const matches = errorMessage?.match(
        /Director details missing: ([\w, ]+)/,
      );

      if (matches && matches[1]) {
        const extractedMissingFields = matches[1]
          .split(',')
          .map((field: any) => field.trim());
        setMissingFields(extractedMissingFields);
        openBottomSheet();
      }
    }
  };
  const handleUpdateMainApplicant = async (values: any) => {
    try {
      const mainApplicantPayload = {
        ...values,
        peopleId,
      };
      const result = await updateMainApplicant(mainApplicantPayload).unwrap();
      if (result) {
        renderToastSuccess(result?.message);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      mainApplicant: '',
    },
    validationSchema: Yup.object({
      mainApplicant: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      const selectedDirector = allDirectorsData?.data.find(
        // eslint-disable-next-line no-underscore-dangle
        director => director.id === values.mainApplicant,
      );
      if (selectedDirector) {
        setPeopleId(selectedDirector.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleSelectMainApplicant(selectedDirector.id);
      } else {
        renderToastError('Please select Main Applicant first');
      }
    },
  });
  const updateApplicantformik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    },
    validationSchema: Yup.object({
      firstName: missingFields.includes('firstName')
        ? Yup.string().required('Required')
        : Yup.string(),
      lastName: missingFields.includes('lastName')
        ? Yup.string().required('Required')
        : Yup.string(),
      dateOfBirth: missingFields.includes('dateOfBirth')
        ? Yup.date().required('Required')
        : Yup.date(),
    }),
    onSubmit: values => {
      const { firstName, lastName, dateOfBirth } = values;
      const updatedData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(dateOfBirth && { dateOfBirth }),
      };
      setTimeout(() => {
        handleUpdateMainApplicant(updatedData);
      }, 500);
    },
  });
  const directorsData = useMemo(() => {
    return allDirectorsData?.data.map(director => ({
      label: `${
        director.firstName
          ? ` ${director.firstName} ${director?.surname ?? ''}`
          : ` ${director.name}`
      }`,
      value: director.id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDirectorsData]);
  const [, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const closeBottomSheet = () => {
    updateApplicantformik?.resetForm();
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };
  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };
  const snapPoints = useMemo(() => ['100%'], []);
  const firstNameRef = useRef() as React.MutableRefObject<TextInput>;
  const lastNameRef = useRef() as React.MutableRefObject<TextInput>;
  const dateOfBirthRef = useRef() as React.MutableRefObject<TextInput>;
  return (
    <ScreenAuth
      title="Main Applicant"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
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

        {!isAllDirectorsLoading ||
          (!isAllDirectorsFetching && (
            <View className="flex-1 justify-center">
              <ActivityIndicator
                size="large"
                color={Colors.light.theme.eccRedColor}
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
                loading={isSelectMainApplicantLoading}
                onClick={() => {
                  formik.handleSubmit();
                }}
              />
            </View>
          </View>
        )}
      </View>
      <BottomSheet
        handleIndicatorStyle={{ backgroundColor: 'transparent' }}
        backgroundStyle={{ backgroundColor: '#FAF9F6' }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <ScreenAuth
          title="Update Main Applicant"
          style={{
            backgroundColor: '#FAF9F6',
          }}
          darkStatus
          topColor="transparent"
          bottomColor={Colors.light.theme.backgroundTopCurveSection}
          appBarProps={{
            light: true,
            rightIcon: true,
          }}
          back={() => {
            closeBottomSheet();
          }}
        >
          <View style={globalStyle.authTopCurvedCard}>
            <KeyboardAwareScrollView
              contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? getRespValue(10) : 20,
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              enableOnAndroid
              extraScrollHeight={20}
              enableAutomaticScroll
              scrollEnabled
              // resetScrollToCoords={{ x: 0, y: 0 }}
              extraHeight={Platform.OS === 'ios' ? getRespValue(250) : 180}
              viewIsInsideTabBar
              keyboardOpeningTime={0}
            >
              {missingFields.includes('firstName') && (
                <View style={[styles.textInput, { marginTop: vs(16) }]}>
                  <FormikInput
                    formik={updateApplicantformik}
                    ref={firstNameRef}
                    name="firstName"
                    inputProps={{
                      ...textInputUnderlinedProps,
                      placeholder: 'First Name',
                      returnKeyType: 'next',
                      onSubmitEditing: () => {},
                    }}
                  />
                </View>
              )}
              {missingFields.includes('lastName') && (
                <View style={[styles.textInput, { marginTop: vs(16) }]}>
                  <FormikInput
                    formik={updateApplicantformik}
                    ref={lastNameRef}
                    name="lastName"
                    inputProps={{
                      ...textInputUnderlinedProps,
                      placeholder: 'Last Name',
                      returnKeyType: 'next',
                      onSubmitEditing: () => {},
                    }}
                  />
                </View>
              )}
              {missingFields.includes('dateOfBirth') && (
                <View style={{ marginTop: vs(16) }}>
                  <FormikDatePicker
                    ref={dateOfBirthRef}
                    formik={updateApplicantformik}
                    name="dateOfBirth"
                    inputProps={{
                      ...textInputUnderlinedProps,
                      placeholder: 'Date of Birth',
                      placeholderTextColor: Colors.light.theme.placeholderColor,
                    }}
                    datePickerProps={{
                      maxDate: moment(new Date(), 'YYYY-MM-DD')
                        .subtract(18, 'years')
                        .toDate(),
                      date: updateApplicantformik.values.dateOfBirth
                        ? moment(
                            updateApplicantformik.values.dateOfBirth,
                            'YYYY-MM-DD',
                          ).toDate()
                        : moment(new Date(), 'YYYY-MM-DD')
                            .subtract(18, 'years')
                            .toDate(),
                    }}
                  />
                </View>
              )}
              <View style={globalStyle.buttonContinue}>
                <Button
                  btnTitle="Update"
                  loading={updateLoading}
                  onClick={() => {
                    updateApplicantformik.handleSubmit();
                  }}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ScreenAuth>
      </BottomSheet>
    </ScreenAuth>
  );
};

export default Step4_Choose_Main_Applicant;
const styles = StyleSheet.create({
  textInput: {
    marginLeft: hs(32),
    marginRight: hs(16),
    marginTop: vs(16),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(8),
    marginBottom: vs(32),
  },
});
