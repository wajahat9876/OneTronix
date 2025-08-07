/* eslint-disable import/order */
import { useSigninType } from '@/store/selectors/common/signin';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text } from '@src/components/libraries';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { ms, vs } from '@utils/design/design';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InputButton } from './input-button';
// Define an array of items representing buttons in the grid
const baseItems = [
  { label: 1 },
  { label: 2 },
  { label: 3 },
  { label: 4 },
  { label: 5 },
  { label: 6 },
  { label: 7 },
  { label: 8 },
  { label: 9 },
  { label: 'backspace' },
  { label: 0 },
  { label: 'done' },
];

// Define the props for the ButtonsGrid component
type ButtonsGridProps = {
  maxInputLength?: number;
  input: string;
  keyboardButtonsColor: string;
  onUpdate: (value: string) => void;
  onBackspace?: (value: string) => void;
  onReset?: () => void;
  onMaxReached?: (pass: string) => void;
  isDisabled?: boolean;
  showBiometric?: boolean;
  onBiometricSuccess?: () => void; // Add this
  onBiometricFail?: () => void;
};

const ButtonsGrid: React.FC<ButtonsGridProps> = React.memo(
  ({
    input,
    keyboardButtonsColor,
    onReset,
    onUpdate,
    onBackspace,
    onMaxReached,
    maxInputLength,
    showBiometric,
    onBiometricSuccess,
    onBiometricFail,
  }) => {
    const { isNetworkConnected } = useAppSelector(useSigninType);
    const items = React.useMemo(() => {
      // Base items without the done/biometric button
      const baseButtonsArray = [
        ...baseItems.slice(0, 9), // First 9 numbers
        { label: 'backspace' },
        { label: 0 },
      ];

      // Add either biometric or done button based on showBiometric
      return [
        ...baseButtonsArray,
        { label: showBiometric ? 'biometric' : 'done' },
      ];
    }, [showBiometric]);
    const onTap = useCallback(
      (label: string | number | null) => {
        if (typeof label === 'number') {
          const newValue = `${input}${label}`;
          // Check if the input length exceeds the limit
          if (newValue.toString().length > (maxInputLength || 11)) {
            return;
          }
          onUpdate(newValue);
          if (newValue.toString().length === (maxInputLength || 11)) {
            setTimeout(() => {
              onMaxReached?.(newValue);
            }, 50);
          }
          return;
        }
        // Handle tap on the backspace button
        if (label === 'backspace') {
          const newValue = input.toString().slice(0, -1);
          onBackspace?.(newValue);
        }
        if (label === 'biometric') {
          handleBiometricAuth();
        }
      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [input, maxInputLength, onBackspace, onMaxReached, onUpdate],
    );
    const handleBiometricAuth = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        Alert.alert('Biometric authemtication is not available');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Biometrics',
        // fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });
      if (!isNetworkConnected) {
        return;
      }
      if (result.success) {
        onBiometricSuccess?.();
      } else {
        onBiometricFail?.();
        // renderToastError('Fail');
      }
    };
    useEffect(() => {
      if (showBiometric) {
        handleBiometricAuth();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNetworkConnected]);

    return (
      <GestureHandlerRootView style={styles.container}>
        {/* Map through the items array to render individual buttons */}
        {items.map(({ label }, index) => {
          return (
            <InputButton
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={styles.input}
              onLongTap={() => {
                // Handle long tap on the backspace button
                if (label === 'backspace') {
                  onReset?.();
                }
              }}
              onTap={() => {
                onTap(label);
              }}
            >
              <View>
                {label === 'biometric' && (
                  <FontAwesome5
                    name="fingerprint"
                    size={34}
                    color={keyboardButtonsColor}
                  />
                )}
                {/* Render the numeric value or backspace icon based on the label */}
                {typeof label === 'number' && (
                  <Text
                    style={{
                      textAlign: 'center',
                      paddingTop: vs(8),
                      fontSize: ms(37),
                      fontFamily: 'poppins-medium',
                      color: keyboardButtonsColor,
                    }}
                  >
                    {label}
                  </Text>
                )}
                {label === 'backspace' && (
                  <FontAwesome5
                    name={label}
                    size={20}
                    color={keyboardButtonsColor}
                  />
                )}
                {label === 'done' && (
                  <FontAwesome5
                    name="arrow-circle-right"
                    size={20}
                    color={keyboardButtonsColor}
                  />
                )}
              </View>
            </InputButton>
          );
        })}
      </GestureHandlerRootView>
    );
  },
);

// ButtonsGrid.defaultProps = {
//   maxInputLength: 11,
// };
// Styles for the ButtonsGrid component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    width: '30%',
    height: '20%',
    marginTop: ms(8),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    marginLeft: `${7 / 3}%`,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    marginBottom: `${7 / 3}%`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Export the ButtonsGrid component
// eslint-disable-next-line import/prefer-default-export
export default ButtonsGrid;
