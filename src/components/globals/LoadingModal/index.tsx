/* eslint-disable import/extensions */
// LoadingModal.js
import Animation1 from '@assets/Loader/ECC Animations.json';
import { getRespValue } from '@utils/getRespValue';
import LottieView from 'lottie-react-native';
import { Modal, StyleSheet, View } from 'react-native';

interface LoadingProps {
  isLoading: boolean;
}
const LoadingModal = ({ isLoading }: LoadingProps) => {
  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBackground}>
          <LottieView
            source={Animation1}
            autoPlay
            loop
            duration={2000}
            style={{
              height: getRespValue(200),
              width: getRespValue(300),
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderBackground: {
    width: 100,
    height: 100,
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingModal;
