import * as LocalAuthentication from 'expo-local-authentication';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BiometricProps {
  isVisible: boolean;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}
const BiometricAuthModal = ({
  isVisible,
  onSuccess,
  onFailure,
}: BiometricProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) handleBiometricAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleBiometricAuth = async () => {
    setLoading(true);
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      onFailure('Biometric authentication is not available.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Biometrics',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      onFailure('Authentication failed');
    }
  };

  return (
    <Modal visible={isVisible}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Biometric Authentication
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
          Please authenticate using your fingerprint or face recognition.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : (
          <TouchableOpacity
            onPress={handleBiometricAuth}
            style={{
              backgroundColor: '#3498db',
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default BiometricAuthModal;
