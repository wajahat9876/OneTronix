/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable camelcase */
import IconIdCard from '@assets/icons/signup/id-card.svg';
import IconPerson from '@assets/icons/signup/person.svg';
import IconTermsAndConditions from '@assets/icons/signup/terms-conditions.svg';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';

const Step3_Create_Your_Account = ({ next, back }: MultiStepFormProps) => {
  // const businessDispatch = useAppDispatch();
  // const businessSelector = useAppSelector(useBusinessDetails);
  // const { businessCategory } = businessSelector;

  // const router = useRouter();

  return (
    <ScreenAuth
      title="Create Your Account"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      back={() => {
        if (back) back?.();
      }}
    >
      <View style={globalStyle.authTopCurvedCard}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'poppins-medium',
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: vs(24),
            marginLeft: hs(8),
            marginRight: hs(8),
          }}
        >
          You’re about to subscribe to a Business Account.
        </Text>
        <Text
          style={{
            ...globalStyle.textMedium,
            fontSize: 22,
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: vs(56),
          }}
        >
          3 Easy Steps
        </Text>
        <Text
          style={{
            ...globalStyle.textRegular,
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: vs(16),
          }}
        >
          Open your account
        </Text>

        {/* steps row */}
        <View style={styles.stepsRow}>
          <View className="items-center">
            <IconTermsAndConditions />
            <Text
              style={{
                ...globalStyle.textRegular,
                fontSize: 13,
                marginTop: vs(8),
                alignSelf: 'center',
              }}
            >
              {'Terms and\nConditions'}
            </Text>
          </View>
          <View className="items-center">
            <IconPerson />
            <Text
              style={{
                ...globalStyle.textRegular,
                fontSize: 13,
                marginTop: vs(8),
                alignSelf: 'center',
              }}
            >
              Business Details
            </Text>
          </View>
          <View className="items-center">
            <IconIdCard />
            <Text
              style={{
                ...globalStyle.textRegular,
                fontSize: 13,
                marginTop: vs(8),
                alignSelf: 'center',
              }}
            >
              Verify Id
            </Text>
          </View>
        </View>

        <View style={globalStyle.buttonContinue}>
          <Button
            btnTitle="Continue"
            // onClick={() => {
            //   if (businessCategory === 'nonltd') {
            //     businessDispatch(setBusinessType('manual'));
            //     router.push('/(auth)/Signup/Business/Manual/');
            //   } else if (next) next?.();
            // }}
            onClick={() => {
              next?.();
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};
const styles = StyleSheet.create({
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(32),
    marginLeft: hs(32),
    marginRight: hs(32),
  },
});
export default Step3_Create_Your_Account;
