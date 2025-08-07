/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useBusinessDetails } from '@/store/selectors/business/business';
import {
  setBeneficiaryDetails,
  setIsInternal,
} from '@/store/slices/business/businessSlice';
import TabButtons from '@src/components/commons/TabButton';
import { TabButton } from '@src/components/commons/TabButton/types';
import Button from '@src/components/globals/Button';
import CountryPickerSimple from '@src/components/globals/CountryPickerSimple';
import FormikInput from '@src/components/globals/FormikInput';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { Country } from 'react-native-country-picker-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

export enum SelectMethod {
  IBAN,
  AccountNumber,
}
const Step1_Payee_Details = ({ goTo, next }: MultiStepFormProps) => {
  const [selectedTab, setSelectedTab] = useState<SelectMethod>(
    SelectMethod.IBAN,
  );
  const [isBankCountryPickerVisible, setBankCountryPickerVisible] =
    useState(false);
  const [isAgentCountryPickerVisible, setAgentCountryPickerVisible] =
    useState(false);
  const [countryCodess, setCountryCode] = useState('GB');
  const [agentCountry, setAgentCountryCode] = useState('GB');
  const {
    data: businessData,
    beneficiaryDetails,
    showIbanAccountToggle,
  } = useAppSelector(useBusinessDetails);
  const [isInternal, setInternal] = useState(true);
  const dispatch = useDispatch();

  const selectPayeeCountry = async (country: Country) => {
    setCountryCode(country.cca2);
    formik.setFieldValue('country', country.cca2);
  };
  const selectAgentCountry = async (country: Country) => {
    setAgentCountryCode(country.cca2);
    formik.setFieldValue('agentCountry', country.cca2);
  };

  const Gbpformik = useFormik({
    initialValues: {
      sortCode: beneficiaryDetails?.sortCode || '',
      accountNo: beneficiaryDetails?.accountNo || '',
      creditorName: beneficiaryDetails?.name || '',
      Amount: '',
      reference: '',
    },
    validationSchema: Yup.object({
      creditorName: Yup.string()
        .required('Account holder name is required')
        .min(3, 'Minimum three character require')
        .max(20, 'Maximum 20 characters valid'),
      sortCode: Yup.string().required('Sort code is required'),
      accountNo: Yup.string().required('Account number is required'),
      Amount: Yup.string()
        .matches(
          /^\d+(\.\d{1,2})?$/,
          'Only numbers up to 2 decimal places are allowed',
        )
        .required('Amount is required'),
      reference: Yup.string()
        .required('Reference is required')
        .matches(
          /^[A-Za-z0-9 ]*$/,
          'Only letters, numbers and spaces are allowed',
        ),
    }),

    onSubmit: values => {
      dispatch(setBeneficiaryDetails(values));
      setTimeout(() => {
        next?.();
      }, 300);
    },
  });

  const formik = useFormik({
    initialValues: {
      iban: beneficiaryDetails?.iban || '',
      payeeName: beneficiaryDetails?.payeeName || '',
      Amount: '',
      name: beneficiaryDetails?.payeeName || '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postCode: '',
      bic: '',
      agentName: '',
      country: 'GB',
      agentCountry: 'GB',
      reference: '',
      accountNumber: beneficiaryDetails?.accountNumber || '',
    },
    validationSchema: Yup.object({
      payeeName: isInternal
        ? Yup.string()
            .required('Account holder name is required')
            .min(3, 'Minimum three character require')
            .max(20, 'Maximum 20 characters valid')
        : Yup.string().notRequired(),
      iban:
        selectedTab === 0
          ? Yup.string()
              // .matches(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, 'Invalid IBAN format')
              .required('IBAN is required')
          : Yup.string().notRequired(),
      Amount: Yup.string()
        .matches(
          /^\d+(\.\d{1,2})?$/,
          'Only numbers up to 2 decimal places are allowed',
        )
        .required('Amount is required'),
      reference: Yup.string()
        .required('Reference is required')
        .matches(
          /^[A-Za-z0-9 ]*$/,
          'Only letters, numbers and spaces are allowed',
        ),
      name: !isInternal
        ? Yup.string().required('Name is required')
        : Yup.string().notRequired(),
      addressLine1: !isInternal
        ? Yup.string()
            .required('Receiver Address is required')
            .max(70, 'Address Line 1 cannot exceed 70 characters')
        : Yup.string().notRequired(),
      addressLine2: !isInternal
        ? Yup.string()
            .required('Business Address is required')
            .max(35, 'Address Line 2 cannot exceed 35 characters')
        : Yup.string().notRequired(),
      addressLine3: !isInternal
        ? Yup.string()
            .notRequired()
            .max(35, 'Address Line 3 cannot exceed 35 characters')
        : Yup.string().notRequired(),
      postCode: !isInternal
        ? Yup.string().required('Post Code is required')
        : Yup.string().notRequired(),
      bic: !isInternal
        ? Yup.string().required('BIC is required')
        : Yup.string().notRequired(),
      agentName: !isInternal
        ? Yup.string().required('Agent Name is required')
        : Yup.string().notRequired(),
      accountNumber:
        selectedTab === 1
          ? Yup.string().required('Account Number is required')
          : Yup.string().notRequired(),
    }),

    onSubmit: values => {
      const updatedData = {
        ...values,
        iban: selectedTab === 0 ? values.iban : '',
        accountNumber: selectedTab === 1 ? values.accountNumber : '',
      };
      if (isInternal) {
        dispatch(setIsInternal(true));
      } else {
        dispatch(setIsInternal(false));
      }
      dispatch(setBeneficiaryDetails(updatedData));
      setTimeout(() => {
        next?.();
      }, 300);
    },
  });

  useEffect(() => {
    const Iban = formik.values.iban;
    const sortCode = '042786';
    if (!Iban || Iban.includes(sortCode)) {
      setInternal(true);
    } else if (Iban.length > 10 && !Iban.includes(sortCode)) {
      setInternal(false);
    }
    if (selectedTab === 1) {
      setInternal(false);
    }
    // If AccountNumber is present, set selectedTab to AccountNumber
    if (!showIbanAccountToggle && beneficiaryDetails?.accountNumber) {
      setSelectedTab(SelectMethod.AccountNumber);
    }
  }, [formik.values.iban, selectedTab, beneficiaryDetails]);

  const accountNumberRef = useRef() as React.MutableRefObject<TextInput>;
  const AmountRef = useRef() as React.MutableRefObject<TextInput>;
  const sortCodeRef = useRef() as React.MutableRefObject<TextInput>;
  const ReferenceRef = useRef() as React.MutableRefObject<TextInput>;
  const creditorNameRef = useRef() as React.MutableRefObject<TextInput>;
  const AgentNameRef = useRef() as React.MutableRefObject<TextInput>;
  const BICRef = useRef() as React.MutableRefObject<TextInput>;
  const PayeeNameRef = useRef() as React.MutableRefObject<TextInput>;
  const NameRef = useRef() as React.MutableRefObject<TextInput>;
  const AddressLine1Ref = useRef() as React.MutableRefObject<TextInput>;
  const AddressLine2Ref = useRef() as React.MutableRefObject<TextInput>;
  const AddressLine3Ref = useRef() as React.MutableRefObject<TextInput>;
  const PostCodeRef = useRef() as React.MutableRefObject<TextInput>;

  const tabButtons: TabButton[] = [
    {
      title: 'IBAN',
      accessibilityLabel: 'Using IBAN',
    },
    {
      title: 'Account Number',
      accessibilityLabel: 'Using Account Number',
    },
  ];

  return (
    <ScreenAuth
      title="Pay & Transfer"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
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
      {businessData?.activeCurrency === 1 && (
        <>
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
            <View style={globalStyle.whiteRoundedCard}>
              <View className="w-full mt-4">
                <Text style={{ ...globalStyle.textMedium, fontSize: 17 }}>
                  Enter Transaction Details
                </Text>

                <>
                  <View style={styles.inputView}>
                    <FormikInput
                      formik={Gbpformik}
                      name="sortCode"
                      ref={sortCodeRef}
                      inputProps={{
                        ...textInputUnderlinedProps,
                        placeholder: 'Sort Code',
                        onSubmitEditing: () => {
                          if (accountNumberRef?.current) {
                            accountNumberRef.current.focus();
                          }
                        },
                      }}
                    />
                  </View>
                  <View style={styles.inputView}>
                    <FormikInput
                      formik={Gbpformik}
                      name="accountNo"
                      ref={accountNumberRef}
                      inputProps={{
                        ...textInputUnderlinedProps,
                        placeholder: 'Account Number',
                        returnKeyType: 'next',
                        onSubmitEditing: () => {
                          if (creditorNameRef?.current) {
                            creditorNameRef.current.focus();
                          }
                        },
                      }}
                    />
                  </View>
                  <View className="w-full">
                    <View style={styles.inputView}>
                      <FormikInput
                        formik={Gbpformik}
                        name="creditorName"
                        ref={creditorNameRef}
                        inputProps={{
                          ...textInputUnderlinedProps,
                          placeholder: 'Account Holder Name',
                          returnKeyType: 'next',
                          onSubmitEditing: () => {
                            if (AmountRef?.current) {
                              AmountRef.current.focus();
                            }
                          },
                        }}
                      />
                    </View>
                  </View>
                  <View className="w-full">
                    <View style={styles.inputView}>
                      <FormikInput
                        formik={Gbpformik}
                        name="Amount"
                        ref={AmountRef}
                        inputProps={{
                          ...textInputUnderlinedProps,
                          placeholder: 'Amount',
                          returnKeyType: 'next',
                          keyboardType: 'decimal-pad',
                          onSubmitEditing: () => {
                            if (ReferenceRef?.current) {
                              ReferenceRef.current.focus();
                            }
                          },
                        }}
                      />
                    </View>
                  </View>
                  <View className="w-full">
                    <View style={styles.inputView}>
                      <FormikInput
                        formik={Gbpformik}
                        name="reference"
                        ref={ReferenceRef}
                        inputProps={{
                          ...textInputUnderlinedProps,
                          placeholder: 'reference',
                          returnKeyType: 'next',
                          onSubmitEditing: () => {
                            // if (lastNameRef?.current) {
                            //   lastNameRef.current.focus();
                            // }
                          },
                        }}
                      />
                    </View>
                  </View>
                </>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.submitBtn}>
            <Button
              btnTitle="Continue"
              onClick={() => {
                Gbpformik.handleSubmit();
              }}
            />
          </View>
        </>
      )}
      {businessData?.activeCurrency !== 1 && (
        <>
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
          >
            {showIbanAccountToggle && (
              <View
                style={{
                  width: '90%',
                  borderRadius: ms(15),
                  overflow: 'hidden',
                  marginTop: vs(5),
                  marginBottom: vs(16),
                  alignSelf: 'center',
                }}
              >
                <TabButtons
                  buttons={tabButtons}
                  // disableRadious
                  hideMarginLeft
                  hideMarginRight
                  selectedTab={selectedTab}
                  setSelectedTab={index => {
                    setSelectedTab(index);
                  }}
                />
              </View>
            )}
            <View style={globalStyle.whiteRoundedCard}>
              <View className="w-full mt-4">
                <Text style={{ ...globalStyle.textMedium, fontSize: 17 }}>
                  Enter Transaction Details
                </Text>
                {selectedTab === 0 ? (
                  <View style={styles.inputView}>
                    <FormikInput
                      formik={formik}
                      name="iban"
                      ref={sortCodeRef}
                      inputProps={{
                        ...textInputUnderlinedProps,
                        placeholder: 'IBAN',
                        onSubmitEditing: () => {
                          if (AmountRef?.current) {
                            AmountRef.current.focus();
                          }
                        },
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.inputView}>
                    <FormikInput
                      formik={formik}
                      name="accountNumber"
                      ref={sortCodeRef}
                      inputProps={{
                        ...textInputUnderlinedProps,
                        placeholder: 'Account Number',
                        onSubmitEditing: () => {
                          if (AmountRef?.current) {
                            AmountRef.current.focus();
                          }
                        },
                      }}
                    />
                  </View>
                )}

                <View className="w-full">
                  <View style={styles.inputView}>
                    <FormikInput
                      formik={formik}
                      name="Amount"
                      ref={AmountRef}
                      inputProps={{
                        ...textInputUnderlinedProps,
                        placeholder: 'Amount',
                        returnKeyType: 'next',
                        keyboardType: 'decimal-pad',
                        onSubmitEditing: () => {
                          if (isInternal && PayeeNameRef?.current) {
                            NameRef.current.focus();
                          } else if (!isInternal && NameRef?.current) {
                            NameRef.current.focus();
                          }
                        },
                      }}
                    />
                  </View>
                </View>
                {isInternal ? (
                  <View className="w-full">
                    <View style={styles.inputView}>
                      <FormikInput
                        formik={formik}
                        name="payeeName"
                        ref={creditorNameRef}
                        inputProps={{
                          ...textInputUnderlinedProps,
                          placeholder: 'Payee Name',
                          returnKeyType: 'next',
                          onSubmitEditing: () => {
                            if (AmountRef?.current) {
                              AmountRef.current.focus();
                            }
                          },
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="name"
                          ref={NameRef}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Receiver Name',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (AddressLine1Ref?.current) {
                                AddressLine1Ref.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.inputView}>
                      <CountryPickerSimple
                        onOpen={() => {
                          setBankCountryPickerVisible(true);
                        }}
                        onClose={() => {
                          setBankCountryPickerVisible(false);
                        }}
                        onSelect={selectPayeeCountry}
                        visible={isBankCountryPickerVisible}
                        theme={{
                          fontSize: 15,
                          onBackgroundTextColor: 'gray',
                        }}
                        countryCode={countryCodess}
                      />
                    </View>
                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="addressLine1"
                          ref={AddressLine1Ref}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Receiver Address 1',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (AddressLine2Ref?.current) {
                                AddressLine2Ref.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="addressLine2"
                          ref={AddressLine2Ref}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Receiver Address 2',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (AddressLine3Ref?.current) {
                                AddressLine3Ref.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="addressLine3"
                          ref={AddressLine3Ref}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Receiver Address 3',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (PostCodeRef?.current) {
                                PostCodeRef.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="postCode"
                          ref={PostCodeRef}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Postal Code',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (AgentNameRef?.current) {
                                AgentNameRef.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="agentName"
                          ref={AgentNameRef}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Receiver Agent Name',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (BICRef?.current) {
                                BICRef.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.inputView}>
                      <CountryPickerSimple
                        onOpen={() => {
                          setAgentCountryPickerVisible(true);
                        }}
                        onClose={() => {
                          setAgentCountryPickerVisible(false);
                        }}
                        onSelect={selectAgentCountry}
                        visible={isAgentCountryPickerVisible}
                        theme={{
                          fontSize: 15,
                          onBackgroundTextColor: 'gray',
                        }}
                        countryCode={agentCountry}
                        // countryCode={countryCodess}
                        // countryCodes={[' ']}
                      />
                    </View>

                    <View className="w-full">
                      <View style={styles.inputView}>
                        <FormikInput
                          formik={formik}
                          name="bic"
                          ref={BICRef}
                          inputProps={{
                            ...textInputUnderlinedProps,
                            placeholder: 'Receiver Agent Bic',
                            returnKeyType: 'next',
                            onSubmitEditing: () => {
                              if (ReferenceRef?.current) {
                                ReferenceRef.current.focus();
                              }
                            },
                          }}
                        />
                      </View>
                    </View>
                  </>
                )}
                <View className="w-full">
                  <View style={styles.inputView}>
                    <FormikInput
                      formik={formik}
                      name="reference"
                      ref={ReferenceRef}
                      inputProps={{
                        ...textInputUnderlinedProps,
                        placeholder: 'Reference',
                        returnKeyType: 'next',
                        keyboardType: 'default',
                        onSubmitEditing: () => {},
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.submitBtn}>
            <Button
              btnTitle="Continue"
              onClick={() => {
                formik.handleSubmit();
              }}
            />
          </View>
        </>
      )}
    </ScreenAuth>
  );
};

export default Step1_Payee_Details;
const styles = StyleSheet.create({
  subHeading: {
    ...globalStyle.textMedium,
    fontSize: 11.76,
    marginTop: vs(16),
  },
  countryPicker: {
    borderWidth: 0,
    borderBottomWidth: 1.5,
    width: '100%',
    borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
    paddingVertical: getRespValue(6),
  },
  submitBtn: {
    width: '90%',
    alignSelf: 'center',
  },
  inputView: { marginRight: hs(16), marginTop: vs(12) },
});
