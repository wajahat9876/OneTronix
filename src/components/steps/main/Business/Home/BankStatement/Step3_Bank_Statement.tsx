/* eslint-disable camelcase */
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { Text, View } from 'react-native';

const Step3_Bank_Statement = () => {
  return (
    <ScreenAuth
      title="Statements"
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
      back={() => {}}
    >
      <View>
        <Text>
          On this screen we will show the bank statement for the selected month
        </Text>
      </View>
    </ScreenAuth>
  );
};

export default Step3_Bank_Statement;
