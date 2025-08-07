/* eslint-disable camelcase */
import ImgCreditCard from '@assets/images/home/img-credit-card-personal.svg';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';
import { CardProps } from '../type';

const Step1_Report_Card = ({ next, parentGoto }: CardProps) => {
  return (
    <ScreenAuth
      title="Report Card"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
      }}
      back={() => {
        parentGoto?.(0);
      }}
    >
      <View className="flex-1 items-center pt-4">
        <ImgCreditCard />
        <View
          style={{
            width: '100%',
            marginTop: vs(32),
            paddingLeft: hs(32),
            paddingRight: hs(24),
          }}
        >
          <Text style={{ ...globalStyle.textMedium, fontSize: 14 }}>
            Are you sure you want to report your card Lost or Stolen?
          </Text>
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 14,
              marginTop: vs(16),
            }}
          >
            Please Note:
          </Text>
          <Text
            style={{
              ...globalStyle.textRegular,
              fontSize: 14,
              marginTop: vs(8),
            }}
          >
            When a card is reported lost or stolen it cannot be unblocked and a
            new card will have to be ordered which is subject to a fee of £5.99.
          </Text>
        </View>
        <View style={{ ...globalStyle.buttonContinue, bottom: vs(24) }}>
          <Button
            btnTitle="Report"
            onClick={() => {
              if (next) next?.();
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step1_Report_Card;
