import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { vs } from "@utils/design/design";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import PortalBottomSheet from "../PortalBottomSheet";
import { PortalBottomSheetRef } from "../PortalBottomSheet/types";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  defaultSelected?: string[];
  onConfirm: (selected: string[]) => void;
  ref: React.RefObject<PortalBottomSheetRef | null>;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  options,
  defaultSelected = [],
  onConfirm,
  ref,
}) => {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  // Keep defaultSelected in sync when props change
  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  // const toggleSelection = (item: string) => {
  //   setSelected((prev) =>
  //     prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
  //   );
  // };
  const toggleSelection = (item: string) => {
    setSelected((prev) => (prev.includes(item) ? [] : [item]));
  };
  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const restoreDefault = () => {
    setSelected(defaultSelected);
  };

  return (
    <PortalBottomSheet
      ref={ref}
      snapPoints={["60%"]}
      handleComponent={undefined}
      enableContentPanningGesture
      enableHandlePanningGesture
      handleIndicatorStyle={{
        backgroundColor: "black",
      }}
      TouchComponent={() => <></>}
      backdropComponent={(
        props // Custom backdrop to handle press
      ) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          onPress={() => ref?.current?.close()}
        />
      )}
    >
      <ScrollView style={styles.modalBox}>
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
            <Text style={{ fontFamily: "Excon-Regular", color: "black" }}>
              {item}
            </Text>
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
      </ScrollView>
    </PortalBottomSheet>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "black",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  confirmBtn: {
    width: "80%",
    alignSelf: "center",
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
    marginBottom: vs(60),
  },
});
