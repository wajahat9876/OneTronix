import React, { useState } from "react";
import {
  GestureResponderEvent,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  defaultSelected?: any[];
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

  React.useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);
  const toggleSelection = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const restoreDefault = () => {
    setSelected(defaultSelected);
  };

  const handleConfirm = (e: GestureResponderEvent) => {
    onConfirm(selected);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBg}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Parameter selection</Text>

          {options.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.row}
              onPress={() => toggleSelection(item)}
            >
              <Checkbox
                status={selected.includes(item) ? "checked" : "unchecked"}
                onPress={() => toggleSelection(item)}
              />
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={{ color: "white" }}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={restoreDefault}>
            <Text style={styles.restoreText}>Restore Default</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  confirmBtn: {
    marginTop: 15,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  restoreText: {
    textAlign: "center",
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
});
