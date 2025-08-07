/* eslint-disable camelcase */
import CheckIcon from '@assets/icons/on-boarding/icon-check.svg';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

const Step5_Card_Pin_Changed = ({ back }: MultiStepFormProps) => {
  return (
    <ScreenAuth
      title="Pin changed"
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
      <View className="items-center justify-center flex-1">
        <CheckIcon />
        <Text
          style={{
            ...globalStyle.textSemibold,
            fontSize: 24,
            marginTop: vs(24),
            marginLeft: hs(16),
            marginRight: hs(16),
            textAlign: 'center',
          }}
        >
          Card Pin Changed Successfully.
        </Text>
        <View style={{ ...globalStyle.buttonContinue, bottom: vs(16) }}>
          <Button btnTitle="Continue" onClick={() => {}} />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step5_Card_Pin_Changed;
