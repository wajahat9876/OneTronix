/* eslint-disable import/extensions */
// LoadingModal.js
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

interface LoadingProps {
  isLoading: boolean;
}
const LoadingModal = ({ isLoading }: LoadingProps) => {
  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBackground}>
          <ActivityIndicator size="large" color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loaderBackground: {
    width: 100,
    height: 100,
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingModal;
