import GreenCiircle from "@assets/icons/ghost.svg";
import EmptyCiircle from "@assets/icons/ghost1.svg";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ms, vs } from "@utils/design/design";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
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
    visible && (
      <PortalBottomSheet
        ref={ref}
        snapPoints={["54%"]}
        handleComponent={undefined}
        enableContentPanningGesture
        enableHandlePanningGesture
        handleIndicatorStyle={{
          backgroundColor: "black",
        }}
        backgroundStyle={{ backgroundColor: "#E4E5E8" }}
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
        <ScrollView
          style={styles.modalBox}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true} // ✅ crucial for Android
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Filters</Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: ms(10),
              color: "gray",
              fontFamily: "Excon-Regular",
              width: "50%",
              textAlign: "center",
            }}
          >
            Select the filter to view its information
          </Text>

          {options.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.row}
              onPress={() => toggleSelection(item)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontFamily: "Excon-Regular",
                  color: "black",
                }}
              >
                {item}
              </Text>

              {selected.includes(item) ? (
                <GreenCiircle width={30} height={30} />
              ) : (
                <EmptyCiircle width={30} height={30} />
              )}
              {/* <Checkbox
                status={selected.includes(item) ? "checked" : "unchecked"}
                onPress={() => toggleSelection(item)}
                color="white"
              /> */}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmText}>Done</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={restoreDefault}>
          <Text style={styles.restoreText}>Restore Default</Text>
        </TouchableOpacity> */}
        </ScrollView>
      </PortalBottomSheet>
    )
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalBox: {
    flex: 1,
    backgroundColor: "#E4E5E8",
    padding: 20,
  },
  title: {
    fontSize: ms(18),
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "black",
    fontFamily: "Excon-Medium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
  },
  confirmBtn: {
    width: "80%",
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "#F4192C",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 60,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Ranade-Regular",
    paddingVertical: vs(6),
    fontSize: ms(16),
  },
  restoreText: {
    textAlign: "center",
    marginTop: 10,
    color: "#007AFF",
    textDecorationLine: "underline",
    marginBottom: vs(60),
  },
});
