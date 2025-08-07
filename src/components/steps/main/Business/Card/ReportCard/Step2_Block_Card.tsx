/* eslint-disable camelcase */
import ImgCreditCard from '@assets/images/home/img-credit-card-personal.svg';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

const Step2_Block_Card = ({ next, back }: MultiStepFormProps) => {
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
        if (back) back?.();
      }}
    >
      <View className="flex-1 items-center pt-4">
        <ImgCreditCard />

        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 14,
            marginTop: vs(56),
            textAlign: 'center',
            marginLeft: hs(16),
            marginRight: hs(16),
          }}
        >
          You are about to block/cancel your card.
        </Text>
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 14,
            marginTop: vs(32),
            textAlign: 'center',
            marginLeft: hs(16),
            marginRight: hs(16),
          }}
        >
          Please press continue below to confirm your choice.
        </Text>
      </View>
      <View style={{ ...globalStyle.buttonContinue, bottom: vs(42) }}>
        <Button
          btnTitle="Continue"
          onClick={() => {
            if (next) next?.();
          }}
        />
      </View>
    </ScreenAuth>
  );
};

export default Step2_Block_Card;
