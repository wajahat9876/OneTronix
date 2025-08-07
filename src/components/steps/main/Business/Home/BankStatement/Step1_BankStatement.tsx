/* eslint-disable react/no-this-in-sfc */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useLazyGbpEStatementQuery,
  useMultiEStatementMutation,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import BankIcon from '@assets/BankStatement/BankStatement.png';
import Button from '@src/components/globals/Button';
import DropdownRNE from '@src/components/globals/DropdownRNE';
import FormikDatePicker from '@src/components/globals/FormikDatePicker';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { BankStatementProps } from './type';

import { textInputUnderlinedProps } from '@src/constants/Props';
import { getRespValue } from '@utils/getRespValue';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Step1_BankStatement = ({ parentGoto }: BankStatementProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const [businessStatement, { isLoading }] = useMultiEStatementMutation();
  const [trigger, { isLoading: gbpLoading, isFetching }] =
    useLazyGbpEStatementQuery();
  const [month, setMonth] = useState<string>('');
  const [payloadDates, setPayloadDates] = useState<{
    selectedDate: string;
    toDate: string;
  }>({
    selectedDate: '',
    toDate: '',
  });

  const [year, setYear] = useState<string>('');
  const [isVerified, setVerifiedAt] = useState<string | null>(null);

  const verifiedDate = moment(businessData?.registredAt, 'DD/MM/YYYY', true);
  // const today = moment();
  const createdYear = useMemo(
    () => moment(verifiedDate).year(),
    [verifiedDate],
  );
  const createdMonth = useMemo(
    () => moment(verifiedDate).month() + 1,
    [verifiedDate],
  );
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;

  useEffect(() => {
    if (verifiedDate) {
      setVerifiedAt(moment(verifiedDate).format('YYYY-MM-DD'));
    }
  }, [verifiedDate]);

  const yearOptions = useMemo(
    () =>
      Array.from(
        { length: currentYear - createdYear + 1 },
        (_, i) => createdYear + i,
      ),
    [createdYear, currentYear],
  );
  const monthOptions = useMemo(() => {
    const selectedYear = parseInt(year, 10);
    if (!selectedYear || !createdYear) return [];

    const today = moment();
    const currentMonth = today.month() + 1; // month is 0-indexed in moment

    const startMonth = 1;
    let endMonth = 12;

    if (selectedYear === currentYear) {
      const isCurrentMonthComplete = today.isSame(
        today.clone().endOf('month'),
        'day',
      );
      endMonth = isCurrentMonthComplete ? currentMonth : currentMonth - 1;
    }

    const months = [];
    // eslint-disable-next-line no-plusplus
    for (let m = startMonth; m <= endMonth; m++) {
      months.push({
        label: moment()
          .month(m - 1)
          .format('MMMM'),
        value: m,
      });
    }

    return months;
  }, [year, createdYear, currentYear]);

  // const monthOptions = useMemo(() => {
  //   const selectedYear = parseInt(year, 10);
  //   if (!selectedYear) return [];

  //   const today = moment();
  //   const isCurrentMonthComplete = today.isSame(
  //     today.clone().endOf('month'),
  //     'day',
  //   );

  //   let months: number[] = [];

  //   if (selectedYear === createdYear && selectedYear === currentYear) {
  //     months = Array.from(
  //       { length: currentMonth - createdMonth + 1 },
  //       (_, i) => createdMonth + i,
  //     );
  //   } else if (selectedYear === createdYear) {
  //     months = Array.from(
  //       { length: 12 - createdMonth + 1 },
  //       (_, i) => createdMonth + i,
  //     );
  //   } else if (selectedYear === currentYear) {
  //     months = Array.from({ length: currentMonth }, (_, i) => i + 1);
  //   } else {
  //     months = Array.from({ length: 12 }, (_, i) => i + 1);
  //   }

  //   // Remove current month if it's not complete
  //   if (selectedYear === currentYear && !isCurrentMonthComplete) {
  //     months = months.filter(m => m < currentMonth);
  //   }

  //   return months.map(m => ({
  //     label: moment()
  //       .month(m - 1)
  //       .format('MMMM'),
  //     value: m,
  //   }));
  // }, [year, createdYear, createdMonth, currentYear, currentMonth]);

  useEffect(() => {
    if (month && year && isVerified) {
      const firstDayOfMonth = moment(`${year}-${month}-01`)
        .startOf('month')
        .format('YYYY-MM-DD');

      const fromDate = moment(firstDayOfMonth).isBefore(isVerified)
        ? isVerified
        : firstDayOfMonth;

      const oneMonthAfter = moment(fromDate)
        .endOf('month')
        .format('YYYY-MM-DD');

      const currentDate = moment().format('YYYY-MM-DD');

      const toDate = moment(oneMonthAfter).isAfter(currentDate)
        ? currentDate
        : oneMonthAfter;

      setPayloadDates({
        selectedDate: fromDate,
        toDate,
      });
    }
  }, [month, year, isVerified]);

  const handleGbpSubmit = async (values: any) => {
    try {
      const res = await trigger({
        from: moment(values?.fromDate).format('YYYY-MM-DD'),
        to: moment(values?.toDate).format('YYYY-MM-DD'),
      }).unwrap();
      renderToastSuccess(res?.message);
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
      fromDate: Yup.string().required('From Date is required'),
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
      handleGbpSubmit(values);
    },
  });

  const handleMultiSubmit = async () => {
    try {
      const selectedYear = moment(payloadDates?.selectedDate).format('YYYY');
      // const selectedMonth = moment(payloadDates?.selectedDate).format('MM');
      const selectedMonth = month;

      const res = await businessStatement({
        year: selectedYear,
        month: selectedMonth,
      }).unwrap();
      renderToastSuccess(res?.message);
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const handleSubmit = () => {
    handleMultiSubmit();
  };
  return (
    <ScreenAuth
      title="E-Statements"
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
      <View className="flex-1 items-center ">
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 items-center ">
            <Image source={BankIcon} />
            {/* <BankIcon /> */}
          </View>
          <Text
            style={{
              marginBottom: 10,
              fontWeight: '700',
              alignSelf: 'flex-start',
              paddingLeft: 18,
              paddingRight: 20,
            }}
          >
            Please select the year and then the month for which you require an
            E-Statement:
          </Text>
          {businessData?.activeCurrency === 1 ? (
            <>
              <Text
                style={{
                  fontWeight: '600',
                  alignSelf: 'flex-start',
                  marginLeft: 35,
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                From Date
              </Text>
              <FormikDatePicker
                formik={formik}
                name="fromDate"
                inputProps={{
                  ...textInputUnderlinedProps,
                  placeholder: 'Select From Date',
                  placeholderTextColor: Colors.light.theme.placeholderColor,
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
              <Text
                style={{
                  fontWeight: '600',
                  alignSelf: 'flex-start',
                  marginLeft: 35,
                  fontSize: 14,
                  marginBottom: 10,
                  marginTop: 20,
                }}
              >
                To Date
              </Text>
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
              />
            </>
          ) : (
            <>
              <View>
                <Text
                  style={{
                    marginBottom: 10,
                    fontWeight: '600',
                    alignSelf: 'flex-start',
                    marginLeft: 15,
                    fontSize: 14,
                  }}
                >
                  Year
                </Text>
                {/* Year Dropdown */}
                <DropdownRNE
                  data={yearOptions.map(y => ({
                    label: y.toString(),
                    value: y,
                  }))}
                  value={year}
                  dropdownType="lg"
                  labelField="label"
                  valueField="value"
                  onChange={item => {
                    setYear(item.value);
                    setMonth('');
                  }}
                  style={{
                    width: '90%',
                    marginLeft: 10,
                    backgroundColor: '#FAF9F6',
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 15,
                  }}
                  dropdownPosition="bottom"
                  placeholder="Select Year"
                />
              </View>
              {/* Month Dropdown */}
              <View>
                <Text
                  style={{
                    fontWeight: '600',
                    alignSelf: 'flex-start',
                    marginLeft: 15,
                    fontSize: 14,
                  }}
                >
                  Month
                </Text>
                <DropdownRNE
                  data={monthOptions}
                  value={month}
                  dropdownType="lg"
                  labelField="label"
                  valueField="value"
                  onChange={item => setMonth(item.value)}
                  style={{
                    width: '90%',
                    marginLeft: 10,
                    padding: 15,
                    marginTop: 15,
                    borderRadius: 10,
                    backgroundColor: '#FAF9F6',
                  }}
                  dropdownPosition="bottom"
                  placeholder="Select Month"
                  disabled={!year}
                />
              </View>
            </>
          )}
          <Text
            style={{
              marginBottom: 10,
              fontWeight: '500',
              alignSelf: 'flex-start',
              marginTop: getRespValue(20),
              paddingLeft: 18,
              paddingRight: 20,
              fontSize: 10,
              color: Colors?.dark?.errorText,
            }}
          >
            Note: Your e-statement will be sent to your verified email address.
          </Text>
        </ScrollView>
        {businessData?.activeCurrency === 1 ? (
          <View style={globalStyle.buttonContinue}>
            <Button
              btnTitle="Generate E-Statement"
              loading={isLoading || isFetching}
              disabled={isLoading || isFetching}
              onClick={() => {
                formik.handleSubmit();
              }}
            />
          </View>
        ) : (
          <View style={globalStyle.buttonContinue}>
            <Button
              btnTitle="Generate E-Statement"
              loading={isLoading || isFetching}
              disabled={
                isLoading || !month || !payloadDates?.selectedDate || isFetching
              }
              onClick={() => {
                handleSubmit();
              }}
            />
          </View>
        )}
      </View>
    </ScreenAuth>
  );
};

export default Step1_BankStatement;
