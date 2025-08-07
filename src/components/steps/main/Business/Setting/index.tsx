// eslint-disable-next-line import/order
// eslint-disable-next-line import/order
import SettingItem from '@src/components/commons/main/settings_stack/SettingItem';
import GlobalLogout from '@src/components/globals/BuisnessLogoutModal';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { ScrollView, StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const Settings = ({ goTo }: MultiStepFormProps) => {
  const router = useRouter();

  // useEffect(() => {
  //   if (data?.alerts) {
  //     setAlert(data?.alerts === true);
  //   }
  // }, [data?.alerts]);
  // const toggleAlert = async () => {
  //   const newAlertState = !alert;
  //   try {
  //     const res = await transactionAlert({ type: newAlertState }).unwrap();
  //     setAlert(newAlertState);
  //     renderToastSuccess(res?.message);
  //   } catch (error: any) {
  //     renderToastError(error?.data?.message || 'Something went wrong');
  //   }
  // };
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Settings"
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
          router.replace('/(main)/Business/Home');
        }}
      >
        <View style={styles.container}>
          <ScrollView>
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
              }}
            >
              Currency
            </Text>
            <SettingItem
              title="Add New Currency"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(1);
              }}
            />
            <SettingItem
              title="Currency Exchange"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(2);
              }}
            />
            <SettingItem
              title="Accounts Detail"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(8);
              }}
            />
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
              }}
            >
              Others
            </Text>

            <SettingItem
              title="Linked Devices"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(12);
              }}
            />
            <SettingItem
              title="Cut-off Time"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(13);
              }}
            />
            <SettingItem
              title="Fee Invoice"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(11);
              }}
            />
            <SettingItem
              title="My Plan"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(7);
              }}
            />
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
              }}
            >
              About App
            </Text>
            <SettingItem
              title="FAQS"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(4);
              }}
            />
            <SettingItem
              title="Legals"
              marginTop={vs(24)}
              onClick={() => {
                goTo?.(3);
              }}
            />
            {/* <AlertsSettingsItem
              title="Transaction Alerts"
              switchValue={alert}
              onSwitchValueChange={toggleAlert}
            /> */}
            <View style={{ marginBottom: vs(24) }}>
              <GlobalLogout key="dsa" marginTop={vs(24)} />
            </View>
          </ScrollView>
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: hs(16),
    marginTop: vs(24),

    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
});
export default Settings;
