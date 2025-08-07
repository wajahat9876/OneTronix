/* eslint-disable import/order */
// eslint-disable-next-line import/order
import SettingItem from '@src/components/commons/main/settings_stack/SettingItem';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { ScrollView, StyleSheet } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { hs, vs } from '@utils/design/design';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const Legals = ({ goTo }: MultiStepFormProps) => {
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Legals"
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
        <View style={styles.container}>
          <ScrollView>
            <SettingItem
              title="Business Terms & Conditions"
              marginTop={vs(16)}
              onClick={() => {
                goTo?.(5);
              }}
            />
            <SettingItem
              title="Privacy Policy"
              marginTop={vs(16)}
              onClick={() => {
                goTo?.(6);
              }}
            />
            <SettingItem
              title="Anti Bribery Corruption Policy"
              marginTop={vs(16)}
              onClick={() => {
                goTo?.(9);
              }}
            />
            <SettingItem
              title="Cookie Policy"
              marginTop={vs(16)}
              onClick={() => {
                goTo?.(10);
              }}
            />
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
    marginBottom: vs(24),
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
});

export default Legals;
