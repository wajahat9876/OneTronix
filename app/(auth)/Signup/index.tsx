import ImgChooseAccTypeBusiness from '@assets/images/signup/business/ecc illus 1.svg';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Tabs from '@src/components/globals/Tabs';
import TabContent from '@src/components/globals/Tabs/TabContent';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const Signup = () => {
  const router = useRouter();

  return (
    <>
      <View style={globalStyle.mainWhiteBackground} />
      <Animated.View
        {...pageTransitionAnimation}
        key="signup"
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        <ScreenAuth
          title="Business"
          style={{ backgroundColor: 'transparent' }}
          topColor="transparent"
          bottomColor={Colors.light.theme.backgroundTopCurveSection}
          darkStatus
          appBarProps={{
            light: true,
            rightIcon: false,
          }}
          back={() => {
            if (router.canGoBack()) router.back();
          }}
        >
          <View style={globalStyle.authTopCurvedCard}>
            <Tabs
              header={[]}
              content={[
                <TabContent
                  title="Business"
                  description="You’ll have full access to your money 24 hours a day, 7 days a week, allowing you to stay in control of your Business payments with real-time notifications."
                  image={<ImgChooseAccTypeBusiness />}
                  onContinueClick={() => {
                    router.push('/(auth)/Signup/Business');
                  }}
                />,
              ]}
            />
          </View>
        </ScreenAuth>
      </Animated.View>
    </>
  );
};

export default Signup;
