import FaceIdSettingsItem from '@src/components/commons/main/settings_stack/FaceIdSettingsItem';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SettingProps } from '../type';

const FaceId = ({ parentGoto }: SettingProps) => {
  const [faceAuth, setFaceAuth] = useState<boolean>(false);
  const [atmWithdrawal, setAtmWithdrawal] = useState<boolean>(false);
  const onToggleFaceAuthSwitch = () => setFaceAuth(!faceAuth);
  const onToggleAtmWithdrawalSwitch = () => setAtmWithdrawal(!atmWithdrawal);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="face_id"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Face ID"
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
          parentGoto?.(0);
        }}
      >
        <View style={styles.container}>
          <Text style={{ ...globalStyle.textMedium, fontSize: 17 }}>
            Face ID
          </Text>
          <FaceIdSettingsItem
            title="Enable Face Authentication"
            switchValue={faceAuth}
            onSwitchValueChange={onToggleFaceAuthSwitch}
          />
          <FaceIdSettingsItem
            title="ATM Withdrawal"
            switchValue={atmWithdrawal}
            onSwitchValueChange={onToggleAtmWithdrawalSwitch}
          />
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 15,
              marginTop: vs(24),
              marginLeft: hs(16),
              marginRight: hs(32),
              textAlign: 'center',
            }}
          >
            A payment larger then £500 will require to enter password before
            they will be processed.
          </Text>
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
export default FaceId;
