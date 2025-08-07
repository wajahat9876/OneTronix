/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useLazyGetMulticurrencyStatementQuery,
  useLazyGetTargetedStatementQuery,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Statemenicon from '@assets/icons/home-screen/Statement-Icon.svg';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { renderItem } from '@src/components/commons/HomeTransactions';
import FormikDatePicker from '@src/components/globals/FormikDatePicker';
import LoadingModal from '@src/components/globals/LoadingModal';
import PortalBottomSheet from '@src/components/globals/PortalBottomSheet';
import { PortalBottomSheetRef } from '@src/components/globals/PortalBottomSheet/types';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import TransactionSummary from '@src/components/globals/TransactionSummary';
import Colors from '@src/constants/Colors';
import { textInputUnderlinedProps } from '@src/constants/Props';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError } from '@src/hooks/useToasty';
import { hs, ms, vs } from '@utils/design/design';
import { useFormik } from 'formik';
import moment from 'moment';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import { HomeProps } from '../type';

interface step1Props extends HomeProps {
  setStatementData: (data: any) => void;
}

const Step1_Monthly_Statement = ({ parentGoto, next }: step1Props) => {
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const { data: businessData } = useAppSelector(useBusinessDetails);
  useEffect(() => {
    const item = {
      from: formik.values.fromDate,
      to: formik.values.toDate,
    };

    handleSubmit(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [trigger, { isFetching }] = useLazyGetTargetedStatementQuery();
  const [transDetails, setTransDetails] = useState(null);
  const [multiTrigger, { isFetching: multiFetching }] =
    useLazyGetMulticurrencyStatementQuery();
  const [statementData, setStatementData] = useState<any>(null);
  const verifiedAt = businessData?.registredAt;
  const availableMonths = useMemo(() => {
    if (!verifiedAt) return [];
    const startDate = moment(verifiedAt, 'DD/MM/YYYY');
    if (!startDate.isValid()) {
      return [];
    }
    const endDate = moment(); // current date
    const months: { label: string; from: string; to: string }[] = [];
    while (
      startDate.isBefore(endDate, 'month') ||
      startDate.isSame(endDate, 'month')
    ) {
      const from = startDate.clone().startOf('month').format('YYYY-MM-DD');
      const to = startDate.clone().endOf('month').format('YYYY-MM-DD');
      months.push({
        label: startDate.format('MMMM YYYY'),
        from,
        to,
      });
      startDate.add(1, 'month');
    }
    return months.reverse();
  }, [verifiedAt]);
  const handleMulti = async (item: any) => {
    try {
      const res = await multiTrigger({
        from: item?.from,
        to: item?.to,
      });
      if (res) {
        setStatementData(res);
        // next?.();
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const formik = useFormik({
    initialValues: {
      fromDate: moment(businessData?.registredAt, 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      ),
      toDate: moment().format('YYYY-MM-DD'),
    },
    validationSchema: Yup.object({
      fromDate: Yup.string()
        .required('From Date is required')
        .test(
          'is-before-to',
          'From Date must be before or same as To Date',
          function (value) {
            const { toDate } = this.parent;
            return moment(value).isSameOrBefore(moment(toDate));
          },
        ),
      toDate: Yup.string()
        .required('To Date is required')
        .test(
          'is-after-from',
          'To Date must be after From Date',
          function (value) {
            const { fromDate } = this.parent;
            return moment(value).isSameOrAfter(moment(fromDate));
          },
        ),
    }),
    onSubmit: values => {
      const item = {
        from: values.fromDate,
        to: values.toDate,
      };

      if (businessData?.activeCurrency === 1) {
        handleGbp(item);
      } else {
        handleMulti(item);
      }
    },
  });
  const handleGbp = async (item: any) => {
    try {
      const res = await trigger({
        from: item?.from,
        to: item?.to,
      });
      if (res) {
        setStatementData(res);
        // next?.();
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const handleSubmit = (item: any) => {
    if (businessData?.activeCurrency === 1) {
      handleGbp(item);
    } else {
      handleMulti(item);
    }
  };
  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };
  return (
    <ScreenAuth
      title="Statements"
      style={{
        backgroundColor: 'white',
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        parentGoto?.(0);
      }}
    >
      <View className="items-center">
        <Statemenicon height={vs(40)} />
      </View>

      {/* <View className="flex-1 items-center "><BankIcon /> */}
      <Text style={styles.headerText}>
        Please select date range for statement
      </Text>
      <>
        <Text style={styles.fromtoText}>From Date</Text>
        <FormikDatePicker
          formik={formik}
          name="fromDate"
          inputProps={{
            ...textInputUnderlinedProps,
            placeholder: 'Select From Date',
            placeholderTextColor: Colors.light.theme.placeholderColor,
          }}
          onDateConfirm={(date: Date) => {
            const formattedFromDate = moment(date).format('YYYY-MM-DD');
            formik.setTouched({ fromDate: true });
            // Use setValues to ensure atomic update
            formik.setFieldValue('fromDate', formattedFromDate, true);
            // Delay submit until Formik has updated values
            setTimeout(() => {
              formik.validateForm().then(errors => {
                if (Object.keys(errors).length === 0) {
                  formik.handleSubmit();
                } else {
                  setStatementData(null);
                }
              });
            }, 1);
          }}
          datePickerProps={{
            // minimumDate: moment(
            // businessData?.registredAt,
            //   'DD/MM/YYYY',
            // ).toDate(),
            maxDate: moment().toDate(),
            // minDate: moment(
            // businessData?.registredAt,
            //   'DD/MM/YYYY',
            // ).toDate(),
            date: moment(formik.values.fromDate, 'YYYY-MM-DD').toDate(),
          }}
        />
        <Text style={styles.fromtoText}>To Date</Text>
        <FormikDatePicker
          formik={formik}
          name="toDate"
          inputProps={{
            ...textInputUnderlinedProps,
            placeholder: 'Select To Date',
            placeholderTextColor: Colors.light.theme.placeholderColor,
          }}
          datePickerProps={{
            maxDate: moment().toDate(),

            // minDate: moment(
            // formik.values.fromDate,
            //   'YYYY-MM-DD',
            // ).toDate(),
            date: moment(formik.values.toDate, 'YYYY-MM-DD').toDate(),
          }}
          onDateConfirm={(date: Date) => {
            const formattedToDate = moment(date).format('YYYY-MM-DD');

            formik.setTouched({ toDate: true });
            // Use setValues to ensure atomic update
            formik.setFieldValue('toDate', formattedToDate, true);

            // Delay submit until Formik has updated values
            setTimeout(() => {
              formik.validateForm().then(errors => {
                if (Object.keys(errors).length === 0) {
                  formik.handleSubmit();
                } else {
                  setStatementData(null);
                }
              });
            }, 1);
          }}
        />
      </>

      <Text
        style={{
          fontSize: ms(15),
          marginTop: vs(20),
          marginBottom: vs(5),
          marginLeft: hs(35),
          fontWeight: '700',
        }}
      >
        {!statementData?.data?.data?.length
          ? 'No Transactions Found'
          : formik.values.fromDate ===
              moment(businessData?.registredAt, 'DD/MM/YYYY').format(
                'YYYY-MM-DD',
              ) && formik.values.toDate === moment().format('YYYY-MM-DD')
          ? 'All Transactions'
          : `Transactions from ${moment(formik.values.fromDate).format(
              'DD MMM YYYY',
            )} to ${moment(formik.values.toDate).format('DD MMM YYYY')}`}
      </Text>

      <FlatList
        key="Statements"
        data={statementData?.data?.data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: vs(100),
          marginTop: vs(30),
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              openBottomSheet();
              setTransDetails(item);
            }}
          >
            {renderItem({
              item,
              activeCurrency: businessData?.activeCurrency,
            })}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `businesss-${item.label}-${index}`}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 20,
              fontSize: 16,
              color: 'gray',
            }}
          >
            No Data Found
          </Text>
        }
      />
      {/* <FlatList
          key="avail"
          data={availableMonths}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: vs(100) }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  marginHorizontal: hs(20),
                }}
                onPress={() => {
                  handleSubmit(item);
                }}
              >
                <Text
                  style={{
                    marginTop: vs(10),
                    backgroundColor: '#fff',

                    color: Colors.light.theme.eccRedColor,
                  }}
                >
                  {item.label}
                </Text>
                <View
                  style={{ marginBottom: vs(10) }}
                  className=" items-center flex-row justify-between "
                >
                  <Bankicon />
                  <Text className="font-bold">Monthly Statement</Text>
                  <MaterialIcons name="arrow-right" size={42} color="black" />
                </View>
                <View
                  style={{
                    height: 2,
                    backgroundColor: Colors.light.theme.eccRedColor,
                  }}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `business-${item.label}-${index}`}
        /> */}
      <PortalBottomSheet
        ref={bottomSheetRef}
        snapPoints={['55%']}
        handleComponent={undefined}
        enableContentPanningGesture
        enableHandlePanningGesture
        handleIndicatorStyle={{
          backgroundColor: 'black',
        }}
        TouchComponent={() => <></>}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={() => bottomSheetRef.current?.close()}
          />
        )}
      >
        <TransactionSummary
          transactionDetails={transDetails}
          activeCurrency={businessData?.activeCurrency}
        />
      </PortalBottomSheet>

      <LoadingModal isLoading={isFetching || multiFetching} />
    </ScreenAuth>
  );
};

export default Step1_Monthly_Statement;
const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 15,
  },
  fromtoText: {
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 35,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 20,
  },
  headerText: {
    marginBottom: vs(20),
    fontWeight: '800',
    alignSelf: 'center',
    marginTop: vs(15),
    paddingLeft: 18,
    paddingRight: 20,
    fontSize: ms(14),
  },
});
