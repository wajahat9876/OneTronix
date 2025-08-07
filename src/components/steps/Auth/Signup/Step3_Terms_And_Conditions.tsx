/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable camelcase */
// eslint-disable-next-line import/order
import Button from '@src/components/globals/Button';
import CheckboxCustom from '@src/components/globals/CheckBoxCustom';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { BUSINESS_TERMS_CONDITIONS_URL } from '@src/constants/Business';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import IconStepRemaining from 'assets/icons/signup/icon-step-remaining.svg';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';

const Step3_Terms_And_Conditions = ({ next, back }: MultiStepFormProps) => {
  return (
    <ScreenAuth
      title="Terms and Conditions"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      back={() => {
        back?.();
        // if (router.canGoBack()) router.back();
      }}
    >
      <View
        style={[globalStyle.mainTopCurvedCard, { backgroundColor: 'white' }]}
      >
        <SignupStepsHeader
          colorStepOne={Colors.light.theme.signupStepInProgressBackground}
          colorStepTwo={Colors.light.theme.singupStepRemainingBackgroud}
          colorStepThree={Colors.light.theme.singupStepRemainingBackgroud}
          titleStepOne="Terms & Policy"
          titleStepTwo="Details"
          titleStepThree="Verify ID"
          iconStepOne={<IconStepInProgress />}
          iconStepTwo={<IconStepRemaining />}
          iconStepThree={<IconStepRemaining />}
        />
        <View style={{ flex: 1 }}>
          <TermData next={next} />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step3_Terms_And_Conditions;

const TermData = ({ next }: { next: any }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const handleCheckboxToggle = () => {
    setIsAccepted(!isAccepted);
  };

  const handleScroll = debounce(
    (contentOffset, contentSize, layoutMeasurement) => {
      const distanceFromBottom =
        contentSize.height - contentOffset.y - layoutMeasurement.height;
      if (distanceFromBottom < 80) {
        setIsEndReached(true);
      } else {
        setIsEndReached(false);
      }
    },
    200,
  );

  const onScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    handleScroll(contentOffset, contentSize, layoutMeasurement);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{
          backgroundColor: 'transparent',
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          borderTopStartRadius: 30,
          borderTopEndRadius: 30,
          elevation: 0,
          marginBottom: isEndReached ? hs(80) : 0,
        }}
        onScroll={onScroll}
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
      {isEndReached && (
        <View
          style={{
            height: vs(110),
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          <View style={{ paddingHorizontal: hs(20) }}>
            <CheckboxCustom
              checked={isAccepted}
              onToggle={handleCheckboxToggle}
              label="I accept the terms and conditions"
            />
          </View>
          <View>
            <Button
              btnTitle="Continue"
              disabled={!isAccepted}
              onClick={() => {
                if (next) next?.();
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};
