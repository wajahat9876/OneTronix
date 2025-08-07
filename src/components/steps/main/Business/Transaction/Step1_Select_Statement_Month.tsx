/* eslint-disable camelcase */
import ImgBankStatement from '@assets/images/home/img-bank-statement.svg';
import { FlashList } from '@shopify/flash-list';
import BankStatementItem from '@src/components/commons/main/home_stack/BankStatementItem';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { vs } from '@utils/design/design';
import { Text, View } from 'react-native';
import { HomeProps } from '../Home/type';

const data = [
  {
    date: 'January 2024',
  },
  {
    date: 'Febuary 2024',
  },
  {
    date: 'March 2024',
  },
  {
    date: 'April 2024',
  },
  {
    date: 'May 2024',
  },
  {
    date: 'June 2024',
  },
];

const Step1_Select_Statement_Month = ({ next, parentGoto }: HomeProps) => {
  return (
    <ScreenAuth
      title="Statements"
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
        parentGoto?.(0);
      }}
    >
      <View className="flex-1 pt-6 ">
        <View className="w-full items-center">
          <ImgBankStatement />
        </View>

        <View className="flex-1 pl-4 pt-4">
          <Text
            style={{ ...globalStyle.textMedium, fontSize: 14 }}
          >{`Please select the month you require a\nstatement for:`}</Text>
          <FlashList
            data={data}
            renderItem={({ item, index }) => {
              const marginTop = index === 0 ? vs(24) : vs(12);
              return (
                <BankStatementItem
                  date={item.date}
                  marginTop={marginTop}
                  onClick={() => {
                    if (next) next?.();
                  }}
                />
              );
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step1_Select_Statement_Month;
