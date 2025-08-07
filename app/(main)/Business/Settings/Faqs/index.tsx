/* eslint-disable camelcase */
import GlobalWebView from '@src/components/globals/GlobalWebView';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { FAQS_URL } from '@src/constants/Common';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { View } from 'react-native';
// import IconStepDone from 'assets/icons/signup/icon-step-done.svg';

const Faqs = ({ goTo }: MultiStepFormProps) => {
  return (
    <ScreenAuth
      title="FAQS"
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
      <View style={{ flex: 1 }}>
        <GlobalWebView uri={FAQS_URL} />
      </View>
    </ScreenAuth>
  );
};

export default Faqs;
