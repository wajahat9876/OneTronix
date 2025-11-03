import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  defaultSelected?: string[];
  onConfirm: (selected: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  options,
  defaultSelected = [],
  onConfirm,
}) => {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  // Keep defaultSelected in sync when props change
  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const toggleSelection = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const handleBackgroundPress = () => {
    onClose();
  };

  const restoreDefault = () => {
    setSelected(defaultSelected);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Outer background (detect press outside modal) */}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.modalBg}>
          {/* Inner box stops background press */}
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Text style={styles.title}>Parameter Selection</Text>

              {options.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.row}
                  onPress={() => toggleSelection(item)}
                  activeOpacity={0.8}
                >
                  <Checkbox
                    status={selected.includes(item) ? "checked" : "unchecked"}
                    onPress={() => toggleSelection(item)}
                  />
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={restoreDefault}>
                <Text style={styles.restoreText}>Restore Default</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  confirmBtn: {
    marginTop: 15,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
  restoreText: {
    textAlign: "center",
    marginTop: 10,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
