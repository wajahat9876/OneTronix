/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text } from '@src/components/libraries';
import { hs, ms, vs } from '@utils/design/design';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { ISignupStepsHeaderProps } from './types';

const SignupStepsHeader = (props: ISignupStepsHeaderProps) => {
  const {
    colorStepOne,
    colorStepTwo,
    colorStepThree,
    titleStepOne,
    titleStepTwo,
    titleStepThree,
    iconStepOne,
    iconStepTwo,
    iconStepThree,
  } = props;

  const renderIconText = useCallback(
    (icon: any, title: string, textColor: string) => {
      return (
        <View style={styles.iconTextRow}>
          {icon}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'poppins-medium',
              color: textColor,
            }}
          >
            {title}
          </Text>
        </View>
      );
    },
    [],
  );

  // const renderIconText = (icon: any, title: string, textColor: string) => {
  //   return (
  //     <View style={styles.iconTextRow}>
  //       {icon}
  //       <Text
  //         style={{
  //           fontSize: 12,
  //           fontFamily: 'poppins-medium',
  //           color: textColor,
  //         }}
  //       >
  //         {title}
  //       </Text>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Divider style={[styles.divider, { backgroundColor: colorStepOne }]} />
        {renderIconText(iconStepOne, titleStepOne, colorStepOne)}
      </View>
      <View style={styles.column}>
        <Divider style={[styles.divider, { backgroundColor: colorStepTwo }]} />
        {renderIconText(iconStepTwo, titleStepTwo, colorStepTwo)}
      </View>
      <View style={styles.column}>
        <Divider
          style={[styles.divider, { backgroundColor: colorStepThree }]}
        />
        {renderIconText(iconStepThree, titleStepThree, colorStepThree)}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: hs(16),
    marginRight: hs(16),
    marginTop: vs(16),
  },
  column: {
    flex: 0.3,
  },
  iconTextRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: hs(3),
  },
  divider: {
    backgroundColor: 'red',
    height: 3,
    borderRadius: ms(16),
    marginVertical: vs(8),
  },
});
export default SignupStepsHeader;
