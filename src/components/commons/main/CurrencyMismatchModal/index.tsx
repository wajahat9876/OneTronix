import Button from "@src/components/globals/Button"; // Update the path to match your Button component
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface GlobalModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const MismatchCurrency: React.FC<GlobalModalProps> = ({
  visible,
  message,
  onClose,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          <Button btnTitle="Close" onClick={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "white",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginBottom: 20,
  },
});

export default MismatchCurrency;
