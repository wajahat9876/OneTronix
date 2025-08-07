/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { useBusinessAddShareholderMutation } from '@/store/api/business/authApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import EditIcon from '@assets/icons/EditIcon.svg';
import Button from '@src/components/globals/Button';
import Checkbox from '@src/components/globals/Checkbox';
import FormikDatePicker from '@src/components/globals/FormikDatePicker';
import FormikInput from '@src/components/globals/FormikInput';
import FormikPhoneInput from '@src/components/globals/FormikPhoneInput';
import Nationality from '@src/components/globals/Nationality';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { useFormik } from 'formik';
import moment from 'moment';
import { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const DividerLine = () => {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>OR</Text>
      <View style={styles.divider} />
    </View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Step6_Add_Shareholder_Details = ({ back }: MultiStepFormProps) => {
  const [addShareHolderDetails, { isLoading: isAddShareHolderLoading }] =
    useBusinessAddShareholderMutation();
  // const [allShareholdersAdded, { isLoading: isAllShareholderAddedLoading }] =
  //   useBusinessAllShareholdersAddedMutation();
  const businessDetails = useAppSelector(useBusinessDetails);
  const [shareholderss, setShareholders] = useState<any>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const firstNameRef = useRef() as React.MutableRefObject<TextInput>;
  const lastNameRef = useRef() as React.MutableRefObject<TextInput>;
  const fAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const placeRef = useRef() as React.MutableRefObject<TextInput>;
  const sAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const tAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const cityRef = useRef() as React.MutableRefObject<TextInput>;
  const postalCodeRef = useRef() as React.MutableRefObject<TextInput>;
  const ownershipPercentageRef = useRef() as React.MutableRefObject<TextInput>;
  const emailAddressRef = useRef() as React.MutableRefObject<TextInput>;
  const phoneNumberRef = useRef() as React.MutableRefObject<TextInput>;

  // const handleAddShareHolderDetails = async (values: any) => {
  //   try {
  //     const result = await addShareHolderDetails(values).unwrap();
  //     renderToastSuccess(result.message);
  //     firstNameRef.current.clear();
  //     lastNameRef.current.clear();
  //     streetRef.current.clear();
  //     cityRef.current.clear();
  //     postalCodeRef.current.clear();
  //     ownershipPercentageRef.current.clear();
  //     emailAddressRef.current.clear();
  //     phoneNumberRef.current.clear();
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message);
  //   }
  // };
  const handleSaveShareholder = (values: any) => {
    if (isEditing === null) {
      // Adding a new shareholder
      const isDuplicateEmail = shareholderss.some(
        (shareholder: any) => shareholder.email === values.email,
      );

      if (isDuplicateEmail) {
        renderToastError('Email already exists. Please use a different email.');
        return;
      }
    }

    // Map values into the desired
    const formattedPhoneNumber = `+44${values.phoneNumber.replace(
      /[- ]/g,
      '',
    )}`;
    const shareholderData = {
      DirectorAndShares: 'false',
      firstName: values?.firstName,
      lastName: values?.lastName,
      surName: '',
      place: values?.place,
      shareholders: values?.shareholders,
      email: values?.email,
      phoneNumber: formattedPhoneNumber,
      nationality: 'British',
      country: 'GB',
      dateOfBirth: values?.dateOfBirth,
      fAddress: values?.fAddress,
      tAddress: values?.tAddress || '',
      sAddress: values?.sAddress || '',
      city: values?.city,
      postalCode: values?.postalCode,
      address: {
        fAddress: values?.fAddress || '',
        tAddress: values?.tAddress || '',
        sAddress: values?.sAddress || '',
        city: values?.city,
        postalCode: values?.postalCode,
      },
    };

    const updatedShareholders = [...shareholderss];

    if (isEditing !== null) {
      // Editing an existing shareholder
      updatedShareholders[isEditing] = shareholderData;
    } else {
      // Adding a new shareholder
      updatedShareholders.push(shareholderData);
    }

    setShareholders(updatedShareholders);
    setIsEditing(null);
    formik.resetForm();
  };

  const editShareholder = (index: number) => {
    const selectedShareholder = shareholderss[index];

    // Clone the selected shareholder and trim the first three characters from the phone number
    const modifiedShareholder = {
      ...selectedShareholder,
      phoneNumber: selectedShareholder.phoneNumber?.slice(3), // Trim first 3 characters
      fAddress: selectedShareholder?.address?.fAddress,
      sAddress: selectedShareholder?.address?.sAddress,
      tAddress: selectedShareholder?.address?.tAddress,
      city: selectedShareholder?.address?.city,
      postalCode: selectedShareholder?.address?.postalCode,
      // nationality: selectedShareholder?.address?.nationality,
      country: selectedShareholder?.address?.country,
    };
    formik.setValues(modifiedShareholder);
    setIsEditing(index);
  };

  // delete Shareholder
  // Delete handler
  // const deleteShareholder = (index: number) => {
  //   setShareholders((prev: any) => prev.filter((_, i) => i !== index));
  // };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'GB',
      email: '',
      phoneNumber: '',
      shareholders: '',
      fAddress: '',
      sAddress: '',
      tAddress: '',
      nationality: 'British',
      place: '',
      surName: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .required('Required'),
      lastName: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .required('Required'),
      fAddress: Yup.string().required('Required'),
      dateOfBirth: Yup.string().required('Required'),
      place: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      postalCode: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phoneNumber: Yup.string()
        .min(10, 'Must be 10 characters')
        .max(10, 'Must not be greater than 10 digits')
        .required('Required'),
      // currency: Yup.string().required('Required'),
      shareholders: Yup.number()
        .min(33, 'At least 33%')
        .max(100, 'Cannot exceed 100%')
        .required('Required'),
    }),
    onSubmit: values => {
      handleSaveShareholder(values);
    },
  });
  // For Continue Button when all shareholder is added it calls api
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitAll = async () => {
    const totalPercentage = shareholderss.reduce(
      (sum, shareholder) => sum + parseFloat(shareholder.shareholders || 0),
      0,
    );

    if (totalPercentage === 100) {
      try {
        const requestData = { shareHolders: shareholderss };
        const res = await addShareHolderDetails(requestData).unwrap();
        renderToastSuccess(res?.message);
        // handleAllShareholdersAdded();
      } catch (error: any) {
        renderToastError(error?.data?.message);
      }
    } else {
      renderToastError('Total percentage must equal 100% before submission.');
    }
  };
  const mainApplicant =
    businessDetails?.data?.mainApplicant?.directors?.[0] || '';
  const [termsOn, setTermsON] = useState('off');

  const toggleTerms = () => {
    const newTermsState = termsOn === 'off' ? 'on' : 'off';
    setTermsON(newTermsState);
  };

  // If MainApplicant is ShareHolder
  // const handleAllShareholdersAdded = async () => {
  //   try {
  //     const allShareholdersAddedPayload = {
  //       allShareholdersAdded: true,
  //     };
  //     const result = await allShareholdersAdded(
  //       allShareholdersAddedPayload,
  //     ).unwrap();
  //     if (result) {
  //       renderToastSuccess(result?.message);
  //       // router.push('/(auth)/KYC/Business/');
  //     }
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message);
  //   }
  // };
  // will call this function if the director and shareholder are the same person with 100% shares
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDirectorAndShareholderAreSame = async () => {
    if (mainApplicant) {
      try {
        const requestData = {
          DirectorAndShares: 'true',
          firstName: mainApplicant?.firstName,
          lastName: mainApplicant?.lastName,
          surName: '',
          place: mainApplicant?.place,
          shareholders: '100',
          email: mainApplicant?.email || '',
          phoneNumber: mainApplicant?.phoneNumber || '',
          nationality: 'British',
          country: 'GB',
          dateOfBirth: mainApplicant?.dateOfBirth,
          fAddress: mainApplicant?.fAddress || '',
          tAddress: mainApplicant?.tAddress || '',
          sAddress: mainApplicant?.sAddress || '',
          city: mainApplicant?.city || '',
          postalCode: mainApplicant?.postalCode || '',
          address: {
            fAddress: mainApplicant?.fAddress || '',
            tAddress: mainApplicant?.tAddress || '',
            sAddress: mainApplicant?.sAddress || '',
            city: mainApplicant?.city || '',
            postalCode: mainApplicant?.postalCode || '',
          },
        };

        const result = await addShareHolderDetails(requestData).unwrap();
        renderToastSuccess(result.message);
        // if (result) {
        //   handleAllShareholdersAdded();
        // }
      } catch (error: any) {
        console.log('error', error);
        renderToastError(error?.data?.message);
      }
    } else {
      renderToastError('Main Applicant is not selected');
    }
  };
  const { handleBusinessLogout } = useBusinessLogout();
  const trimName = (name, maxLength = 8) => {
    if (!name) return ''; // Handle null or undefined values
    return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
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
        {termsOn === 'off' && (
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <FlatList
              data={shareholderss}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                  <View style={styles.shareholderCard}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 10, color: 'gray' }}>
                          Name
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                          {trimName(item.firstName)}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 10, color: 'gray' }}>
                          Email
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                          {trimName(item.email)}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 10, color: 'gray' }}>
                          Percentage Held
                        </Text>
                        <Text
                          style={{ fontSize: 12 }}
                        >{`${item.shareholders}%`}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => editShareholder(index)}>
                    <EditIcon />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

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
          extraHeight={Platform.OS === 'ios' ? getRespValue(250) : 180}
          viewIsInsideTabBar
          keyboardOpeningTime={0}
        >
          <Text
            style={{
              ...globalStyle.textMedium,
              marginTop: vs(32),
              marginLeft: hs(16),
            }}
          >
            Add Shareholder Details
          </Text>

          <View style={{ width: '100%' }}>
            <Text
              style={{
                ...globalStyle.textRegular,
                marginTop: vs(8),
                marginLeft: hs(16),
              }}
            >
              If the main applicant and shareholder are the same person with
              100% shares please check the box below.
            </Text>
            <Checkbox
              style={{
                marginBottom: termsOn ? vs(100) : 0,
              }}
              className="justify-start"
              value={termsOn}
              onPress={() => {
                toggleTerms();
              }}
              label="The main applicant is your 100% shareholder"
            />
            <DividerLine />
          </View>

          {termsOn === 'off' && (
            <View>
              {/* name section */}
              <Text
                style={{
                  ...globalStyle.textMedium,
                  fontSize: 17,
                  marginTop: vs(32),
                  marginLeft: hs(16),
                }}
              >
                Basic Details
              </Text>

              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={firstNameRef}
                  name="firstName"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'First Name',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (lastNameRef?.current) {
                        lastNameRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={lastNameRef}
                  name="lastName"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Last Name',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (emailAddressRef?.current) {
                        emailAddressRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={emailAddressRef}
                  name="email"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Email',
                    keyboardType: 'email-address',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (phoneNumberRef?.current) {
                        phoneNumberRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>

              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikPhoneInput
                  formik={formik}
                  ref={phoneNumberRef}
                  name="phoneNumber"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    returnKeyType: 'done',
                    keyboardType: 'phone-pad',
                    onChangePhoneNumber(e: any) {
                      // eslint-disable-next-line no-console
                      console.log('input: ', e);
                    },
                  }}
                />
              </View>

              <View style={{ marginTop: vs(16) }}>
                <FormikDatePicker
                  formik={formik}
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
                    date: formik.values.dateOfBirth
                      ? moment(formik.values.dateOfBirth, 'YYYY-MM-DD').toDate()
                      : moment(new Date(), 'YYYY-MM-DD')
                          .subtract(18, 'years')
                          .toDate(),
                  }}
                />
              </View>

              {/* address section */}
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
                  ref={placeRef}
                  name="place"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Apartment Number',
                    returnKeyType: 'done',
                    onSubmitEditing: () => {
                      if (fAddressRef?.current) {
                        fAddressRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={fAddressRef}
                  name="fAddress"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Address Line 1',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (sAddressRef?.current) {
                        sAddressRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={sAddressRef}
                  name="sAddress"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Address Line 2',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (tAddressRef?.current) {
                        tAddressRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={tAddressRef}
                  name="tAddress"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Address Line 3',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (postalCodeRef?.current) {
                        postalCodeRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={postalCodeRef}
                  name="postalCode"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Postal Code',
                    returnKeyType: 'done',
                    onSubmitEditing: () => {
                      if (cityRef?.current) {
                        cityRef?.current.focus();
                      }
                    },
                  }}
                />
              </View>
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={cityRef}
                  name="city"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'City',
                    returnKeyType: 'next',
                    onSubmitEditing: () => {
                      if (ownershipPercentageRef?.current) {
                        ownershipPercentageRef?.current.focus();
                      }
                    },
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

              <Text
                style={{
                  ...globalStyle.textMedium,
                  fontSize: 17,
                  marginTop: vs(32),
                  marginLeft: hs(16),
                }}
              >
                Other Details
              </Text>

              {/* <View style={styles.textInput}>
                <FormikDropdownRNE
                  formik={formik}
                  name="currency"
                  placeholder="Currency"
                  data={[{ label: 'GBP', value: 'GBP' }]}
                  value={formik?.values?.currency}
                  dropdownType="sm"
                  labelField="label"
                  valueField="value"
                  dropdownPosition="bottom"
                />
              </View> */}
              <View style={[styles.textInput, { marginTop: vs(16) }]}>
                <FormikInput
                  formik={formik}
                  ref={ownershipPercentageRef}
                  name="shareholders"
                  inputProps={{
                    ...textInputUnderlinedProps,
                    placeholder: 'Shares',
                    returnKeyType: 'done',
                    keyboardType: 'numeric',
                    onSubmitEditing: () => {},
                  }}
                />
              </View>
              <View style={styles.buttonsRow}>
                <Button
                  btnTitle="Submit"
                  disabled={isAddShareHolderLoading}
                  // loading={isAddShareHolderLoading}
                  btnTitleColor={Colors.light.theme.white}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                />

                <Button
                  btnTitle="Continue"
                  loading={isAddShareHolderLoading}
                  loaderColor={Colors.light.theme.black}
                  btnColor={Colors.light.theme.backgroundBtnLightGray}
                  btnTitleColor={Colors.light.theme.black}
                  onClick={handleSubmitAll}
                />
              </View>
            </View>
          )}
          {termsOn === 'on' && (
            <View style={styles.button}>
              <Button
                btnTitle="Submit"
                loading={isAddShareHolderLoading}
                btnTitleColor={Colors.light.theme.white}
                onClick={handleDirectorAndShareholderAreSame}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
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
  button: {
    marginTop: vs(32),
    marginBottom: vs(24),
    marginLeft: hs(16),
    marginRight: hs(8),
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: hs(32),
    marginTop: vs(32),
    marginBottom: vs(32),
    marginLeft: hs(32),
    marginRight: hs(16),
  },
  shareholderCard: {
    marginLeft: 10,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 3 : 1.5,
    padding: getRespValue(8),
    borderRadius: 8,
    width: '85%',
    marginBottom: 5,
  },
});
export default Step6_Add_Shareholder_Details;
