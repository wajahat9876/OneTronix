/* eslint-disable camelcase */
import SuccessIcon from '@assets/icons/SuccessIcon.svg';
import Button from '@src/components/globals/Button';
import { SafeAreaView, Text } from '@src/components/libraries';
import { hs, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const Step4_PasswordReset = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 justify-center items-center ">
        <View className="mb-4">
          <SuccessIcon />
        </View>
        <Text style={styles.title}> Password Reset Successfully</Text>
        <Text style={styles.subtitle}>
          Congratulations! Your password has been changed.
        </Text>
      </View>

      <View style={styles.button}>
        <Button
          btnTitle="Continue"
          btnColor="rgba(128, 128, 128, 0.5)"
          onClick={() => {
            router.replace('/(auth)/Welcome');
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontFamily: 'poppins-semibold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: vs(32),
    marginLeft: hs(8),
    marginRight: hs(8),
  },
  subtitle: {
    color: 'white',
    fontFamily: 'poppins',
    fontSize: 16,
    textAlign: 'center',
    marginTop: vs(16),
    marginLeft: hs(8),
    marginRight: hs(8),
  },
  button: {
    marginTop: vs(32),
    marginLeft: hs(16),
    marginRight: hs(16),
    bottom: vs(24),
  },
});
export default Step4_PasswordReset;
