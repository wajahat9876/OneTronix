/* eslint-disable import/order */
/* eslint-disable camelcase */
import { setBusinessType } from '@/store/slices/business/businessSlice';
import AccountMethod from '@src/components/commons/business/signup/account_method';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppDispatch } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

const Step4_Choose_Account_Method = ({ back }: MultiStepFormProps) => {
  const router = useRouter();
  const businessDispatch = useAppDispatch();

  return (
    <ScreenAuth
      title="Create Your Account"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      back={() => {
        if (back) back?.();
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: vs(20),
          paddingLeft: hs(16),
          paddingRight: hs(16),
          paddingTop: vs(16),
        }}
      >
        <Text
          style={{
            ...globalStyle.textMedium,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: vs(24),
            marginLeft: hs(8),
            marginRight: hs(8),
          }}
        >
          Account Method
        </Text>

        <View style={{ marginTop: vs(24) }}>
          <AccountMethod
            title="Add by search"
            subtitle="If you want to search your business name from the list."
            onClick={() => {
              businessDispatch(setBusinessType(1));
              router.push('/(auth)/Signup/Business/Auto');
            }}
          />

          <AccountMethod
            title="Add manually"
            subtitle="If your business name does not exist in the search list."
            onClick={() => {
              businessDispatch(setBusinessType(0));
              router.push('/(auth)/Signup/Business/Manual');
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step4_Choose_Account_Method;
