/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useChangeActiveInverterMutation,
  useGetNotificationsQuery,
} from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BellIcon from "@assets/icons/bell.png"; // your SVG bell icon
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import BellIconWhite from "assets/icons/BellIconWhite.png";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropdownRNE from "../DropdownRNE";
import PortalBottomSheet from "../PortalBottomSheet";
import { PortalBottomSheetRef } from "../PortalBottomSheet/types";
interface GlobalHeaderProps {
  backColorLight?: boolean;
}
const NotificationItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.notificationContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.txt}>{item?.title}</Text>
      </View>

      {/* Optional: description or date */}
      {item?.message && <Text style={styles.message}>{item.message}</Text>}
    </View>
  );
};

const GlobalHeader = (props: GlobalHeaderProps) => {
  const { data, auth_token } = useAppSelector(useBusinessDetails);

  const { data: notifications } = useGetNotificationsQuery(
    { deviceId: data?.devices?.[0]?._id },
    {
      skip: !auth_token,
    }
  );
  const [changeInverter, { isLoading }] = useChangeActiveInverterMutation();
  const { backColorLight } = props;

  const [inverters, setInverters] = useState<
    { label: string; value: string }[]
  >([]);
  const [activeInverter, setActiveInverter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Load inverters from API (Redux)
  useEffect(() => {
    if (data?.devices?.length) {
      const mapped = data?.devices.map((device: any) => ({
        label: device?.name || `Inverter ${device?._id}`,
        value: device?._id,
      }));
      setInverters(mapped);

      // Pick default active inverter
      const activeDevice =
        data.devices.find((d: any) => d?.isActive) || data.devices[0];

      setActiveInverter(activeDevice?._id ?? "");
    } else {
      setInverters([]);
      setActiveInverter("");
    }

    setLoading(false);
  }, [data?.devices]);

  // Handle inverter switch
  // Handle inverter switch
  const handleChangeInverter = async (newActiveId: string) => {
    if (newActiveId === activeInverter) return;
    const currentActive = data?.devices?.find((d: any) => d?.isActive);
    setActiveInverter(newActiveId);
    try {
      const res = await changeInverter({
        deviceId: currentActive?._id, // current active inverter
        activeDeviceId: newActiveId, // inverter to activate
      }).unwrap();
      renderToastSuccess(res?.message || "Switched inverter successfully");
    } catch (error: any) {
      renderToastError(error?.data?.message || "Something went wrong");
      setActiveInverter(currentActive?._id ?? "");
    }
  };
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  console.log("notifications", notifications);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: hs(20),
          marginTop: vs(40),
          backgroundColor: "transparent",
          borderBottomLeftRadius: ms(18),
          borderBottomRightRadius: ms(18),
        }}
      >
        {/* LEFT: Dropdown */}
        <View style={{ width: "75%" }}>
          {loading || isLoading ? (
            <ActivityIndicator size="small" color={"red"} />
          ) : (
            <DropdownRNE
              dropdownPosition="bottom"
              dropdownType="custom"
              data={inverters}
              value={activeInverter}
              labelField="label"
              valueField="value"
              placeholder="Select Inverter"
              onChange={(item) => handleChangeInverter(item.value)}
              style={{
                width: "50%",
                borderColor: "gray",
                borderRadius: 8,
                height: vs(40),
                paddingHorizontal: hs(10),
                backgroundColor: "transparent",
              }}
              selectedTextStyle={{
                fontSize: ms(14),
                fontFamily: "Excon-Regular",
                color: backColorLight ? "#000" : "#fff",
              }}
              itemTextStyle={{
                fontSize: ms(13),
                fontFamily: "Excon-Regular",
                color: Colors.light.theme.black,
              }}
              placeholderStyle={{
                fontFamily: "Excon-Regular",
                color: "gray",
              }}
            />
          )}
        </View>

        {/* RIGHT: Bell Icon */}
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef.current?.open();
          }}
        >
          {backColorLight ? (
            <Image source={BellIcon} style={{ width: 25, height: 25 }} />
          ) : (
            <Image source={BellIconWhite} style={{ width: 28, height: 28 }} />
          )}
          {data?.notificationCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "red",
                borderRadius: 10,
                minWidth: 16,
                height: 16,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 3,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {data?.notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <PortalBottomSheet
          ref={bottomSheetRef}
          snapPoints={["90%"]}
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
              onPress={() => bottomSheetRef.current?.close()}
            />
          )}
        >
          <FlatList
            className="mt-4"
            scrollEnabled
            contentContainerStyle={{ paddingTop: vs(24) }}
            data={notifications?.results?.alerts || []}
            renderItem={({ item }) => <NotificationItem item={item} />}
          />
        </PortalBottomSheet>
      </View>
    </>
  );
};

export default memo(GlobalHeader);
const styles = StyleSheet.create({
  notificationContainer: {
    paddingHorizontal: hs(20),
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(4),
  },
  label: {
    fontSize: ms(13),
    color: "gray",
    fontFamily: "Excon-Regular",
  },
  txt: {
    fontSize: ms(13),
    color: Colors.light.theme.black,
    fontFamily: "Excon-Medium",
  },
  message: {
    fontSize: ms(12),
    color: "#666",
    marginTop: vs(2),
    fontFamily: "Excon-Regular",
  },
});
