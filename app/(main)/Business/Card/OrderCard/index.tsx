/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable camelcase */

import BottomSheet from '@gorhom/bottom-sheet';
import Button from '@src/components/globals/Button';
import CheckboxCustom from '@src/components/globals/CheckBoxCustom';
import DropdownRNE from '@src/components/globals/DropdownRNE';
import FormikInput from '@src/components/globals/FormikInput';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text, TouchableOpacity } from '@src/components/libraries';
import { BUSINESS_TERMS_CONDITIONS_URL } from '@src/constants/Business';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { renderToastError } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { useFormik } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import WebView from 'react-native-webview';
import * as Yup from 'yup';

const OrderCard = ({ goTo }: MultiStepFormProps) => {
  // const [stateData, setStateData] = useState<any>();
  // const [cityData, setCityData] = useState<any>();
  // const [getState] = useGetStateMutation();
  // const [getCity] = useGetCityMutation();

  // useEffect(() => {
  //   handleState('GB');
  // }, []);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleCheckboxToggle = () => {
    setIsAccepted(!isAccepted);
  };
  const [, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };
  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };
  const snapPoints = useMemo(() => ['100%'], []);
  // const handleState = async (country: string) => {
  //   try {
  //     const res = await getState({ country }).unwrap();
  //     const formattedStateData = res?.results?.states.map((state: any) => ({
  //       label: state.name,
  //       value: state.isoCode,
  //     }));
  //     setStateData(formattedStateData);
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message);
  //   }
  // };

  // const handleCity = async (state: string) => {
  //   try {
  //     const res = await getCity({ state, country: 'GB' }).unwrap();
  //     const formattedCityData = res?.results?.cities.map((city: any) => ({
  //       label: city.name,
  //       value: city.name,
  //     }));
  //     setCityData(formattedCityData);
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message);
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      postalCode: '',
      city: '',
      street: '',
      houseNumber: '',
      region: '',
    },
    validationSchema: Yup.object({
      postalCode: Yup.string()
        .required('Postal Code is required')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Only letters, numbers allowed'),
      city: Yup.string().required('City is required'),
      street: Yup.string().required('Street is required'),
      region: Yup.string().required('Region is required'),
      houseNumber: Yup.string().required('House Number is required'),
    }),

    onSubmit: async values => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payload = {
        country: 'GB',
        region: values.region,
        city: values.city,
        street: values.street,
        houseNumber: values.houseNumber,
        postalCode: values.postalCode,
      };
      try {
        // const result = await orderCardBusiness({
        //   deliveryAddress: { ...payload },
        //   type: 'physical',
        // }).unwrap();
        // if (result.success) {
        //   next?.();
        // }
        // renderToastSuccess(result?.message);
      } catch (error: any) {
        renderToastError(error?.data?.message);
      }
    },
  });

  const postalCodeRef = useRef() as React.MutableRefObject<TextInput>;
  const streetRef = useRef() as React.MutableRefObject<TextInput>;
  const houseNumberRef = useRef() as React.MutableRefObject<TextInput>;
  const countryRef = useRef() as React.MutableRefObject<TextInput>;

  return (
    <>
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
          rightIcon: true,
        }}
        back={() => {
          goTo?.(0);
        }}
      >
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
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraHeight={Platform.OS === 'ios' ? getRespValue(250) : 180}
          viewIsInsideTabBar
        >
          <View style={globalStyle.whiteRoundedCard}>
            <View className="w-full mt-4">
              <Text
                style={{
                  ...globalStyle.textMedium,
                  fontSize: 17,
                  marginTop: 20,
                }}
              >
                Please fill out below fields
              </Text>
              <View className="w-full">
                <View style={styles.inputView}>
                  <View
                    style={{
                      paddingVertical: ms(7),
                      paddingHorizontal: ms(3),
                      borderBottomWidth: ms(1.5),
                      borderBottomColor:
                        Colors.light.theme.textInputBottomBorderColor,
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>United Kingdom</Text>
                  </View>
                </View>

                <DropdownRNE
                  data={[]}
                  dropdownType="custom"
                  onChange={item => {
                    formik.setFieldValue('region', (item as any).value);
                    // handleCity(item?.value);
                  }}
                  errorText={formik.touched.region && formik.errors.region}
                  valueField="value"
                  labelField="label"
                  value={formik.values.region}
                  placeholder="Select Region"
                  dropdownPosition="auto"
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor:
                      Colors.light.theme.textInputBottomBorderColor,
                    width: '95%',
                    marginTop: 10,
                  }}
                  selectedTextStyle={{
                    fontSize: getRespValue(20),
                    color: 'black',
                    paddingTop: 10,
                    paddingBottom: 5,
                  }}
                  placeholderStyle={{
                    color: 'gray',
                    fontSize: getRespValue(20),
                    paddingTop: 10,
                    paddingBottom: 5,
                  }}
                  itemContainerStyle={{
                    borderBottomWidth: 0.5,
                    borderColor: 'gray',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                />

                <DropdownRNE
                  // data={cityData?.length ? cityData : stateData || []}
                  data={[]}
                  disabled={!formik?.values?.region}
                  dropdownType="custom"
                  valueField="value"
                  labelField="label"
                  value={formik?.values?.city}
                  errorText={formik.touched.city && formik.errors.city}
                  onChange={item => {
                    formik.setFieldValue('city', (item as any).value);
                  }}
                  placeholder="Select City"
                  dropdownPosition="auto"
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor:
                      Colors.light.theme.textInputBottomBorderColor,
                    width: '95%',
                    marginTop: 10,
                  }}
                  selectedTextStyle={{
                    fontSize: getRespValue(20),
                    color: 'black',
                    paddingTop: 10,
                    paddingBottom: 5,
                  }}
                  placeholderStyle={{
                    color: 'gray',
                    fontSize: getRespValue(20),
                    paddingTop: 10,
                    paddingBottom: 5,
                  }}
                  itemContainerStyle={{
                    borderBottomWidth: 0.5,
                    borderColor: 'gray',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                />

                <View style={styles.inputView}>
                  <FormikInput
                    formik={formik}
                    ref={postalCodeRef}
                    name="postalCode"
                    inputProps={{
                      ...textInputUnderlinedProps,
                      placeholder: 'Postal Code',
                      returnKeyType: 'next',
                      onSubmitEditing: () => {
                        if (streetRef?.current) {
                          streetRef.current.focus();
                        }
                      },
                    }}
                  />
                </View>

                <View style={styles.inputView}>
                  <FormikInput
                    formik={formik}
                    name="street"
                    ref={streetRef}
                    inputProps={{
                      ...textInputUnderlinedProps,
                      placeholder: 'Street',
                      returnKeyType: 'next',
                      onSubmitEditing: () => {
                        if (houseNumberRef?.current) {
                          houseNumberRef.current.focus();
                        }
                      },
                    }}
                  />
                </View>

                <View style={styles.inputView}>
                  <FormikInput
                    formik={formik}
                    ref={houseNumberRef}
                    name="houseNumber"
                    inputProps={{
                      ...textInputUnderlinedProps,
                      placeholder: 'House Number',
                      returnKeyType: 'next',
                      onSubmitEditing: () => {
                        if (countryRef?.current) {
                          countryRef.current.focus();
                        }
                      },
                    }}
                  />
                </View>
                <View style={{ paddingVertical: hs(20), flexDirection: 'row' }}>
                  <CheckboxCustom
                    checked={isAccepted}
                    onToggle={handleCheckboxToggle}
                    label="I accept the "
                    labelStyle={{ color: 'black' }}
                  />
                  <TouchableOpacity onPress={openBottomSheet}>
                    <Text style={{ color: '#000F6D' }}>
                      terms and conditons
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.submitBtn}>
          <Button
            btnTitle="Order Now"
            disabled={!isAccepted}
            onClick={() => {
              formik.handleSubmit();
            }}
          />
        </View>
      </ScreenAuth>
      <BottomSheet
        handleIndicatorStyle={{ backgroundColor: 'transparent' }}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
      >
        <View style={globalStyle.mainBlackBackground}>
          <ScreenAuth
            title="Terms and Conditions"
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
              closeBottomSheet();
            }}
          >
            <View style={{ flex: 1 }}>
              <WebView
                containerStyle={{ flex: 1 }}
                source={{ uri: BUSINESS_TERMS_CONDITIONS_URL }}
                startInLoadingState
                nestedScrollEnabled
                androidLayerType="hardware" //
                renderLoading={() => (
                  <View
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: 'white',
                    }}
                  >
                    <ActivityIndicator color="blue" size="large" />
                  </View>
                )}
              />
            </View>
          </ScreenAuth>
        </View>
      </BottomSheet>
    </>
  );
};

export default OrderCard;
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

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitBtn: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: ms(8),
  },
  inputView: { marginRight: hs(16), marginTop: vs(12) },
});
