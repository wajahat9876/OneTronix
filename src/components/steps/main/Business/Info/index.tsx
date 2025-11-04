import { useBusinessDetails } from "@/store/selectors/business/business";
import {
  setLastSelectedDevice,
  setLastSelectedDeviceId,
} from "@/store/slices/business/businessSlice";
import MenuIcon from "@assets/icons/menu.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStatusBar } from "@hooks/StatusBarColor/index";
import DropdownRNE from "@src/components/globals/DropdownRNE";
import HeaderMain from "@src/components/globals/HeaderMain";
import { PortalBottomSheetRef } from "@src/components/globals/PortalBottomSheet/types";
import AddDeviceQr from "@src/components/steps/Qr/AddDeviceQr";
import { pageTransitionAnimation } from "@src/constants/Animation";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms, vs } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
const Step0_Info = ({ goTo }: MultiStepFormProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  useStatusBar("dark");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  //Qr Code
  const [isActive, setActive] = useState(false);
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const closeBottomSheet = () => {
    setActive(false);
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openBottomSheet = () => {
    setActive(true);
    setBottomSheetVisible(true);
    bottomSheetRef.current?.open();
  };
  const snapPoints = useMemo(() => ["100%"], []);
  const [, setBottomSheetVisible] = useState(false);

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <HeaderMain
        title=""
        style={{
          backgroundColor: "transparent",
        }}
        topColor=""
        bottomColor={"transparent"}
        darkStatus={true}
        disableTopSafeArea
        appBarProps={{
          light: false,
        }}
        // disableAppBar
        back={() => {}}
      >
        <View style={styles.container}>
          <Text
            style={{
              fontFamily: "Excon-Medium",
              fontSize: ms(20),
              alignSelf: "center",
              marginBottom: vs(10),
            }}
          >
            Device Management
          </Text>

          {/* Expandable Card */}
          <View
            style={[
              styles.card,
              {
                height: expanded
                  ? businessData?.devices?.length <= 3
                    ? "auto"
                    : "55%"
                  : "auto",
              },
            ]}
          >
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
                <MaterialCommunityIcons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={30}
                  color="gray"
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>

            {expanded && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <FlatList
                  data={businessData?.devices ?? []}
                  keyExtractor={(item) => item._id || item.name}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingVertical: 10 }}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.mainRow}>
                        <View style={styles.menuRow}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.deviceTxt}>{item?.name}</Text>
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
                              dispatch(setLastSelectedDevice(item?.settings));
                              dispatch(setLastSelectedDeviceId(item?._id));

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
              </ScrollView>
            )}
          </View>
          <TouchableOpacity
            onPress={openBottomSheet}
            style={styles.redCircle}
            activeOpacity={0.8}
          >
            <Text style={styles.PlusTxt}>+</Text>
          </TouchableOpacity>

          <AddDeviceQr
            snapPoints={snapPoints}
            bottomSheetRef={bottomSheetRef}
            key="dssa"
            closeBottomSheet={closeBottomSheet}
            active={isActive}
            next={closeBottomSheet}
          />
        </View>
      </HeaderMain>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeView: { flex: 1, backgroundColor: "white" },
  container: { flex: 1, paddingHorizontal: hs(20), marginTop: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginTop: 10,
    borderWidth: 0.6,
    borderColor: "#C7C7C7",
    width: "100%",
  },
  redCircle: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  PlusTxt: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subTitle: {
    fontSize: ms(20),
    fontFamily: "Excon-Medium",
  },

  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainRow: {
    paddingVertical: 15,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    marginTop: vs(10),
    borderRadius: 10,
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

  statusDot: {
    width: hs(8),
    height: vs(10),
    borderRadius: 5,
    marginLeft: 3,
    marginTop: 4,
  },
});

export default Step0_Info;
export const dummyInverters = [
  {
    _id: "68b7d75efaf365edde9db2a2",
    deviceId: "123489",
    type: "hybrid",
    model: "1kva",
    status: "active",
    name: "My Invdsadsaerter",
    isActive: true,
    settings: {
      battery: {
        low: 10.1,
        full: 14.5,
        floating: 13.65,
        chargingAmp: 8,
        typeOfBattery: "Lead Acid",
        fullToFloat: 1,
        floatToCutOff: 1,
      },
      utility: {
        underVolts: 180,
        overVolts: 260,
      },
      utilityControl: {
        enabled: false,
        onLevel: 13.8,
        offLevel: 12.5,
        cutOffTime: 10,
      },
      chargingSource: {
        type: "Utility + Solar",
      },
      solar: {
        highVolts: 450,
        lowVolts: 180,
      },
      heavyLoad: {
        onLevel: 13.8,
        offLevel: 12.5,
        onTime: 10,
        offTime: 1,
      },
      inverter: {
        outputVoltLevel: 230,
        overLoad: 5,
      },
      misc: {
        buzzer: true,
        lcdBacklight: true,
      },
    },
    updateStatus: {
      applied: false,
      lastUpdatedAt: "2025-11-04 12:42:41",
      lastUpdateMessage: "Pending push to inverter from user",
    },
    createdAtPK: "2025-09-03 10:51:26",
    createdAt: "2025-09-03T05:51:26.485Z",
    updatedAt: "2025-11-04T07:42:41.475Z",
    lastPacketAt: "2025-11-01 15:59:28",
    userId: "68d77b60f13e8330e9751991",
    installerId: "68ffd265d6bf1ae79a3c65d9",
    __v: 0,
  },
];
