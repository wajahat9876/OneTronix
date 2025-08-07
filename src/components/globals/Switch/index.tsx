/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/forbid-prop-types */
import { Animated, StyleSheet, View } from 'react-native';

import { Text, TouchableOpacity } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { ms } from '@utils/design/design';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Easing } from 'react-native-reanimated';
import { ISwitchProps } from './types';

const Switch = (props: ISwitchProps) => {
  const {
    isOn,
    style,
    onToggle,
    labelStyle,
    label,
    toggleStyles,
    backgroundColor,
    backgroundColorActive,
    toggleColor,
    toggleColorActive,
    disabled,
  } = props;

  const animatedValue = new Animated.Value(0);

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  animatedValue.setValue(isOn ? 0 : 1);

  Animated.timing(animatedValue, {
    toValue: isOn ? 1 : 0,
    duration: 300,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

  return useMemo(
    () => (
      <View>
        <TouchableOpacity
          onPress={typeof onToggle === 'function' ? onToggle : undefined}
          disabled={disabled}
        >
          <View
            style={[
              styles.toggleContainer,
              style,
              {
                backgroundColor: isOn
                  ? backgroundColorActive || 'black'
                  : backgroundColor || 'rgba(0,0,0,0.4)',
              },
            ]}
          >
            <Animated.View
              style={[
                styles.toggleWheelStyle,
                {
                  backgroundColor: isOn
                    ? toggleColorActive || Colors.light.theme.darkYellow
                    : toggleColor || Colors.light.theme.darkYellow,
                  marginLeft: moveToggle,
                },
                { ...toggleStyles },
              ]}
            />
          </View>
        </TouchableOpacity>

        {!!label && (
          <Text
            style={[styles.label, labelStyle]}
            className="font-aeonik text-black ml-4"
          >
            {label}
          </Text>
        )}
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOn, disabled, label],
  );
};
const styles = StyleSheet.create({
  toggleContainer: {
    width: 45,
    height: 30,
    paddingLeft: 2,
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  label: {
    marginRight: 2,
    fontSize: ms(20),
  },
  toggleWheelStyle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
});

Switch.propTypes = {
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  label: PropTypes.string,
  onToggle: PropTypes.func,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
};

// Switch.defaultProps = {
//   onColor: '#4cd137',
//   offColor: '#ecf0f1',
//   label: '',
//   onToggle: () => {},
//   style: {},
//   isOn: false,
//   labelStyle: {},
// };

export default Switch;
