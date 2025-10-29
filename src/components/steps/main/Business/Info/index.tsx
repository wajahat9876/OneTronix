import { useBusinessDetails } from "@/store/selectors/business/business";
import { setLastSelectedDevice } from "@/store/slices/business/businessSlice";
import MenuIcon from "@assets/icons/menu.png";
import { useStatusBar } from "@hooks/StatusBarColor/index";
import DropdownRNE from "@src/components/globals/DropdownRNE";
import { pageTransitionAnimation } from "@src/constants/Animation";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
const Step0_Info = ({ goTo }: MultiStepFormProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  useStatusBar("dark");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
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
                renderItem={({ item }) => {
                  return (
                    <View style={styles.mainRow}>
                      <View style={styles.menuRow}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.deviceTxt}>Inverter</Text>
                          <View
                            style={[
                              styles.statusDot,
                              {
                                backgroundColor:
                                  item.isActive || item.status === "active"
                                    ? "#4CAF50"
                                    : "transparent",
                              },
                            ]}
                          />
                        </View>
                        <DropdownRNE
                          data={[
                            { label: "Setting", value: "Setting" },
                            { label: "Edit", value: "Edit" },
                          ]}
                          dropdownType="custom"
                          onChange={(e) => {
                            dispatch(setLastSelectedDevice(item));
                            if (e?.value === "Setting") {
                              goTo?.(1);
                            } else if (e?.value === "Edit") {
                            }
                          }}
                          renderRightIcon={() => (
                            <Image
                              source={MenuIcon}
                              style={{ width: 25, height: 20 }}
                            />
                          )}
                          renderLeftIcon={() => {}}
                          valueField="value"
                          labelField="label"
                          value={""}
                          placeholder=""
                          dropdownPosition="auto"
                          style={{
                            width: "30%",
                            // marginTop: 10,
                          }}
                          selectedTextStyle={{
                            color: "transparent",
                          }}
                          placeholderStyle={{
                            color: "black",
                            fontSize: getRespValue(20),
                            paddingTop: 10,
                            paddingBottom: 5,
                          }}
                          itemContainerStyle={{}}
                          itemTextStyle={{
                            fontSize: ms(11),
                            fontFamily: "Excon-Regular",
                          }}
                        />
                        {/* <TouchableOpacity onPress={() => {}}>
                        <Image
                          source={MenuIcon}
                          style={{ width: 25, height: 20 }}
                        />
                      </TouchableOpacity> */}
                      </View>
                      <Text style={styles.idTxt}>
                        ID: {item.deviceId || "-"}
                      </Text>
                    </View>
                  );
                }}
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
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginTop: 20,
    width: "100%",
  },
  subTitle: {
    fontSize: ms(20),
    fontWeight: "600",
    fontFamily: "Excon-Regular",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainRow: {
    paddingVertical: 15,
    backgroundColor: "#DDDEE0",
    paddingHorizontal: 10,

    borderRadius: 5,
  },
  deviceTxt: {
    color: "black",
    fontSize: ms(14),
    fontFamily: "Excon-Regular",
  },
  idTxt: {
    color: "gray",
    fontSize: ms(12),
    fontFamily: "Excon-Regular",
  },
  deviceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: hs(8),
    height: vs(10),
    borderRadius: 5,
    marginLeft: 3,
    marginTop: 4,
  },
});

export default Step0_Info;
