/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import TableCard from '@src/components/commons/main/TableCard';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { ScrollView, StyleSheet, Text } from 'react-native';

const currencyMinimumValues = {
  CAD: 17,
  CHF: 11,
  CZK: 279,
  DKK: 86,
  GBP: 10,
  HUF: 4411,
  NOK: 134,
  PLN: 52,
  RON: 54,
  SEK: 135,
  USD: 13,
  EUR: 12,
};
const CutOffTime = [
  {
    name: 'Currency',
    currency: 'Currency Code',
    time: 'FX Cut-off Time(SameDay)',
  },
  {
    name: 'Czech Koruna',
    currency: 'CZK',
    time: '08:30',
  },
  {
    name: 'Romanian Leu',
    currency: 'RON',
    time: '08:30',
  },
  {
    name: 'Hungarian Forint',
    currency: 'HUF',
    time: '09:30',
  },
  {
    name: 'Polish Zloty',
    currency: 'PLN',
    time: '09:30',
  },
  {
    name: 'Swiss Franc',
    currency: 'CHF',
    time: '11:00',
  },
  {
    name: 'Danish Krone',
    currency: 'DKK',
    time: '11:00',
  },
  {
    name: 'Norwegian Krone',
    currency: 'NOK',
    time: '11:00',
  },
  {
    name: 'Swedish Krona',
    currency: 'SEK',
    time: '11:00',
  },
  {
    name: 'Euro',
    currency: 'EUR',
    time: '14:30',
  },
  {
    name: 'British Pounds',
    currency: 'GBP',
    time: '14:30',
  },
  {
    name: 'United States Dollar',
    currency: 'USD',
    time: '17:00',
  },
  {
    name: 'Canadian Dollar',
    currency: 'CAD',
    time: '17:00',
  },
];
const Index = ({ goTo }: MultiStepFormProps) => {
  return (
    <ScreenAuth
      title="Cut-off Time"
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
      <ScrollView style={styles.container}>
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 20,
            paddingLeft: 20,
            paddingBottom: 5,
            paddingTop: 20,
          }}
        >
          Cut-off time for exchange
        </Text>
        <Text style={{ fontSize: 12, paddingLeft: 25 }}>
          UK time zone applies{'\n'}
          Operating time is from 07:00 on UK business day
        </Text>
        <TableCard data={CutOffTime} />
      </ScrollView>
    </ScreenAuth>
  );
};

export default Index;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: vs(24),
    paddingHorizontal: hs(5),
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
});
