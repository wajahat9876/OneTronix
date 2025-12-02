// src/components/MonthYearPicker.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  onCancel?: () => void;
  onConfirm: (date: Date) => void;
  selectedTab?: number;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthYearPicker({
  visible,
  value,
  selectedTab,
  minDate = new Date(2020, 0, 1), // default Jan 2020
  maxDate = new Date(), // default now
  onCancel,
  onConfirm,
}: Props) {
  const maxYear = maxDate.getFullYear();
  const minYear = minDate.getFullYear();

  // Generate years list
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = maxYear; y >= minYear; y--) arr.push(y);
    return arr;
  }, [maxYear, minYear]);

  // state
  const [selectedYear, setSelectedYear] = useState<number>(
    value ? value.getFullYear() : maxYear
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    value ? value.getMonth() : maxDate.getMonth()
  );

  // keep in sync if parent value changes
  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setSelectedMonth(value.getMonth());
    }
  }, [value]);

  // ensure selection is always valid inside min/max
  useEffect(() => {
    if (selectedYear === minYear && selectedMonth < minDate.getMonth()) {
      setSelectedMonth(minDate.getMonth());
    }
    if (selectedYear === maxYear && selectedMonth > maxDate.getMonth()) {
      setSelectedMonth(maxDate.getMonth());
    }
  }, [selectedYear]);

  const confirm = () => {
    onConfirm(new Date(selectedYear, selectedMonth, 1));
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={selectedTab === 1 || selectedTab === 2 ? visible : false}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedTab == 1 ? `Select Month & Year` : `Select Year`}
            </Text>
            <TouchableOpacity onPress={confirm}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>

          {/* Months */}
          {selectedTab === 1 ? (
            <>
              <View>
                <Text style={styles.sectionLabel}>Months</Text>
                <View style={styles.monthsContainer}>
                  {monthNames.map((m, idx) => {
                    const disabled =
                      (selectedYear === minYear && idx < minDate.getMonth()) ||
                      (selectedYear === maxYear && idx > maxDate.getMonth());
                    const selected = idx === selectedMonth && !disabled;

                    return (
                      <TouchableOpacity
                        key={m}
                        disabled={disabled}
                        style={[
                          styles.monthButton,
                          selected && styles.monthButtonSelected,
                          disabled && styles.monthButtonDisabled,
                        ]}
                        onPress={() => setSelectedMonth(idx)}
                      >
                        <Text
                          style={[
                            styles.monthText,
                            selected && styles.monthTextSelected,
                            disabled && styles.monthTextDisabled,
                          ]}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              {/* Years */}
              <Text style={styles.sectionLabel}>Years</Text>
              <FlatList
                data={years}
                keyExtractor={(y) => String(y)}
                style={styles.yearList}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => {
                  const selected = item === selectedYear;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.yearItem,
                        selected && styles.yearItemSelected,
                      ]}
                      onPress={() => setSelectedYear(item)}
                    >
                      <Text
                        style={[
                          styles.yearText,
                          selected && styles.yearTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Years</Text>
              <FlatList
                data={years}
                keyExtractor={(y) => String(y)}
                style={styles.yearList}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => {
                  const selected = item === selectedYear;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.yearItem,
                        selected && styles.yearItemSelected,
                      ]}
                      onPress={() => setSelectedYear(item)}
                    >
                      <Text
                        style={[
                          styles.yearText,
                          selected && styles.yearTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  cancelText: { color: "#666" },
  okText: { color: "#0a84ff", fontFamily: "Excon-Medium" },
  title: { fontSize: 15, color: "#222", fontFamily: "Excon-Medium" },
  sectionLabel: {
    fontSize: 13,
    fontFamily: "Excon-Medium",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  monthsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  monthButton: {
    width: (SCREEN_WIDTH - 64) / 4,
    paddingVertical: 8,
    borderRadius: 6,
    margin: 4,
    borderWidth: 0.6,
    borderColor: "#ccc",
    alignItems: "center",
  },
  monthButtonSelected: {
    backgroundColor: "#0a84ff",
    borderColor: "#0a84ff",
  },
  monthButtonDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#eee",
  },
  monthText: { fontSize: 12, color: "#333" },
  monthTextSelected: { color: "white", fontFamily: "Excon-Regular" },
  monthTextDisabled: { color: "#aaa" },
  yearList: { maxHeight: 200, marginHorizontal: 12 },
  yearItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  yearItemSelected: { backgroundColor: "#f0f8ff" },
  yearText: { fontSize: 14, color: "#222" },
  yearTextSelected: { color: "#0a84ff", fontFamily: "Excon-Regular" },
});
