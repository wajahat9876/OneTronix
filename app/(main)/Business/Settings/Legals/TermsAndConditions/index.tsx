/* eslint-disable camelcase */
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { BUSINESS_TERMS_CONDITIONS_URL } from '@src/constants/Business';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { ActivityIndicator, View } from 'react-native';
// import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import WebView from 'react-native-webview';

const TermsAndConditions = ({ goTo }: MultiStepFormProps) => {
  return (
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
        goTo?.(3);
      }}
    >
      <View style={{ flex: 1 }}>
        <WebView
          containerStyle={{}}
          source={{
            uri: BUSINESS_TERMS_CONDITIONS_URL,
          }}
          startInLoadingState
          renderLoading={() => {
            return (
              <ActivityIndicator
                color="blue"
                size="large"
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
              />
            );
          }}
        />
      </View>
    </ScreenAuth>
  );
};

export default TermsAndConditions;
