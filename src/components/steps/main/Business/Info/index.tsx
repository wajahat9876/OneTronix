import { useBusinessDetails } from "@/store/selectors/business/business";
import { useStatusBar } from "@hooks/StatusBarColor/index";
import { pageTransitionAnimation } from "@src/constants/Animation";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const Step0_Info = () => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  useStatusBar("dark");

  const [expanded, setExpanded] = useState(false);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <SafeAreaView
        style={styles.safeView}
        edges={Platform.OS === "android" ? ["top"] : ["top", "bottom"]}
      >
        <View style={styles.container}>
          <Text
            style={{
              fontFamily: "Ranade-Medium",
              fontSize: ms(20),
              alignSelf: "center",
            }}
          >
            Device Management
          </Text>

          {/* Expandable Card */}
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.subTitle, { marginBottom: 8 }]}>
                  Inverter
                </Text>
                <Text style={[styles.subTitle, { marginBottom: 8 }]}>
                  {expanded ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>

            {expanded && (
              <FlatList
                data={businessData?.devices ?? []}
                keyExtractor={(item) => item._id || item.name}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => (
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceTxt}>Inverter</Text>
                    <Text style={styles.deviceTxt}>
                      ID: {item.deviceId || "-"}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeView: { flex: 1, backgroundColor: "white" },
  container: { flex: 1, paddingHorizontal: hs(20), marginTop: 20 },
  card: {
    backgroundColor: "#E2E1E0",
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginTop: 20,
    width: "100%",
  },
  subTitle: {
    fontSize: getRespValue(25),
    fontWeight: "600",
    fontFamily: "Excon-Medium",
  },
  deviceRow: {
    paddingVertical: 8,
  },
  deviceTxt: {
    color: "black",
    fontSize: getRespValue(20),
    fontFamily: "Excon-Regular",
  },
});

export default Step0_Info;
