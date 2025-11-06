/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useChangeActiveInverterMutation,
  useGetNotificationsQuery,
  useReadNotificationsMutation,
} from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BellIcon from "@assets/icons/bell.png"; // your SVG bell icon
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import { useFocusEffect } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
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
interface GlobalHeaderProps {}
const NotificationItem = ({ item }: { item: any }) => {
  console.log("item", item);
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.txt}>{item?.title}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.txt}>{item?.deviceRef?.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Model:</Text>
        <Text style={styles.txt}>{item?.deviceRef?.model}</Text>
      </View>

      {/* Optional: description or date */}
      {item?.message && <Text style={styles.message}>{item.message}</Text>}
    </View>
  );
};
const GlobalHeaderMain = (props: GlobalHeaderProps) => {
  const [changeInverter, { isLoading }] = useChangeActiveInverterMutation();
  const {} = props;
  const { data, auth_token } = useAppSelector(useBusinessDetails);
  const [readNotifications, { isLoading: readLoading }] =
    useReadNotificationsMutation();
  const { data: notifications, refetch: notificationRefetch } =
    useGetNotificationsQuery(
      { deviceId: data?.activeDevice?._id || data?.activeDevice?._id },
      {
        skip: !auth_token,
      }
    );

  const [inverters, setInverters] = useState<
    { label: string; value: string }[]
  >([]);
  const [activeInverter, setActiveInverter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Load inverters from API (Redux)
  useEffect(() => {
    if (data?.devices?.length) {
      const mapped = data.devices.map((device: any) => ({
        label: device?.name || `Inverter ${device?._id}`,
        value: device?._id,
      }));
      setInverters(mapped);
      // Pick default active inverter
      const activeDevice =
        data?.devices.find((d: any) => d?.isActive) || data?.activeDevice;
      setActiveInverter(activeDevice?._id ?? "");
    } else {
      setInverters([]);
      setActiveInverter("");
    }

    setLoading(false);
  }, [data?.devices]);
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);

  const handleChangeInverter = async (newActiveId: string) => {
    if (newActiveId === activeInverter) return;
    setIsDropdownDisabled(true);
    setTimeout(() => setIsDropdownDisabled(false), 2000);
    const currentActive = data?.devices?.find((d: any) => d?.isActive);
    setActiveInverter(newActiveId);
    try {
      const res = await changeInverter({
        deviceId: currentActive?._id, // current active inverter
        activeDeviceId: newActiveId, // inverter to activate
      }).unwrap();
      notificationRefetch();
      renderToastSuccess(res?.message || "Switched inverter successfully");
    } catch (error: any) {
      renderToastError(error?.data?.message || "Something went wrong");
      setActiveInverter(currentActive?._id ?? "");
    }
  };
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const handleReadNotifications = async () => {
    bottomSheetRef.current?.open();
    try {
      if (data?.notificationCount > 0) {
        await readNotifications({
          deviceId: data?.activeDevice?._id || data?.activeDevice?._id,
        }).unwrap();
      }
    } catch (error: any) {}
  };

  useFocusEffect(
    useCallback(() => {
      // 👇 Refetch when screen gains focus
      if (auth_token) notificationRefetch();
    }, [])
  );

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: hs(20),
          marginTop: vs(40),
          height: vs(60),
          backgroundColor: "transparent",
          borderBottomLeftRadius: ms(10),
          borderBottomRightRadius: ms(10),
        }}
      >
        {/* LEFT: Dropdown */}
        <View style={{ width: "75%" }}>
          <DropdownRNE
            disabled={isDropdownDisabled}
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
              fontFamily: "Excon-Medium",
              color: "#000",
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
            iconColor="black"
            iconStyle={{ marginTop: vs(3) }}
          />
        </View>

        <TouchableOpacity
          style={{ marginLeft: hs(30) }}
          onPress={() => {
            handleReadNotifications();
          }}
        >
          <Image source={BellIcon} style={{ width: 25, height: 25 }} />

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
          snapPoints={["100%"]}
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
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: vs(10),
                paddingHorizontal: hs(20),
              }}
            >
              <TouchableOpacity
                style={{
                  left: hs(0),
                }}
                onPress={() => {
                  bottomSheetRef?.current?.close();
                }}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={ms(26)}
                  color="#000"
                  style={{ marginRight: hs(4) }}
                />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Excon-Medium",
                    fontSize: ms(16),
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  Notifications
                </Text>
              </View>
            </View>
            <FlatList
              className="mt-4"
              scrollEnabled
              ListEmptyComponent={() => (
                <Text style={styles.empTxt}>No Data Found</Text>
              )}
              contentContainerStyle={{ paddingTop: vs(24) }}
              data={notifications?.results?.alerts || []}
              renderItem={({ item }) => <NotificationItem item={item} />}
            />
          </>
        </PortalBottomSheet>
      </View>
    </>
  );
};

export default memo(GlobalHeaderMain);
const styles = StyleSheet.create({
  notificationContainer: {
    paddingHorizontal: hs(20),
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  empTxt: {
    textAlign: "center",
    fontFamily: "Excon-Regular",
    fontSize: ms(13),
    color: "gray",
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
    fontSize: ms(14),
    color: "#666",
    marginTop: vs(2),
    fontFamily: "Excon-Regular",
  },
  card: {
    alignSelf: "center",
    marginLeft: 1,
    justifyContent: "space-between",
    borderRadius: 10,
    borderColor: "#C7C7C7",
    borderWidth: 0.6,
    padding: 20,
    width: "95%",
    elevation: 0,
    marginBottom: 1,
    paddingHorizontal: hs(20),
    paddingVertical: vs(10),
  },
});
