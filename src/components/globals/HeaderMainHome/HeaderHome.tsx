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
import alertIcon from "@assets/icons/alerts.png";
import BellIcon from "@assets/icons/bell.png"; // your SVG bell icon
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import BellIconWhite from "assets/icons/BellIconWhite.png";
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
import { ScrollView } from "react-native-gesture-handler";
import DropdownRNE from "../DropdownRNE";
import PortalBottomSheet from "../PortalBottomSheet";
import { PortalBottomSheetRef } from "../PortalBottomSheet/types";
interface GlobalHeaderProps {
  backColorLight?: boolean;
}
const NotificationItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Image
          source={alertIcon}
          style={{
            width: 40,
            height: 40,
            alignSelf: "center",
          }}
        />
        <View>
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
      </View>
    </View>
  );
};

const GlobalHeader = (props: GlobalHeaderProps) => {
  const { data, auth_token } = useAppSelector(useBusinessDetails);
  const {
    data: notifications,
    refetch: notificationRefetch,
    isFetching,
  } = useGetNotificationsQuery(
    { deviceId: data?.activeDevice?._id || data?.activeDevice?._id },
    {
      skip: !auth_token,
    }
  );
  const [changeInverter, { isLoading }] = useChangeActiveInverterMutation();
  const [readNotifications, { isLoading: readLoading }] =
    useReadNotificationsMutation();
  const { backColorLight } = props;

  const [inverters, setInverters] = useState<
    { label: string; value: string }[]
  >([]);
  const [activeInverter, setActiveInverter] = useState<string>("");

  // Load inverters from API (Redux)
  useEffect(() => {
    if (data?.devices?.length) {
      const mapped = data?.devices.map((device: any) => ({
        label: device?.name || `Inverter ${device?._id}`,
        value: device?._id,
      }));
      setInverters(mapped);

      // Always update when activeDevice changes
      if (data?.activeDevice?._id) {
        setActiveInverter(data?.activeDevice?._id);
      } else {
        const activeDevice = data?.devices.find((d: any) => d?.isActive);
        setActiveInverter(activeDevice?._id ?? "");
      }
    } else {
      setInverters([]);
      setActiveInverter("");
    }
  }, [data?.devices, data?.activeDevice?._id]);
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
      setTimeout(() => {
        notificationRefetch();
      }, 1000);
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
              width: 1,
              ellipsizeMode: "tail",
              fontFamily: "Excon-Medium",
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
            iconColor={backColorLight ? "black" : "white"}
            iconStyle={{ marginTop: vs(3) }}
          />
        </View>

        {/* RIGHT: Bell Icon */}
        <TouchableOpacity
          style={{ marginLeft: hs(30) }}
          disabled={isLoading || isFetching}
          onPress={() => {
            handleReadNotifications();
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
          snapPoints={["100%"]}
          handleComponent={undefined}
          enableContentPanningGesture
          enableHandlePanningGesture
          handleIndicatorStyle={{
            backgroundColor: "transparent",
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
          <View style={{ flex: 1 }}>
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
                  Alerts
                </Text>
              </View>
            </View>
            <ScrollView
              style={{ flex: 1, marginBottom: vs(10) }}
              showsVerticalScrollIndicator={false}
            >
              <FlatList
                className="mt-4"
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <Text style={styles.empTxt}>No alerts found</Text>
                )}
                contentContainerStyle={{ paddingTop: vs(24) }}
                data={notifications?.results?.alerts || []}
                renderItem={({ item }) => <NotificationItem item={item} />}
              />
            </ScrollView>
          </View>
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
    borderRadius: 1,
    borderColor: "black",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderWidth: 0.6,
    padding: 20,
    marginTop: vs(5),
    width: "99%",
    marginBottom: 1,
    paddingHorizontal: hs(20),
    paddingVertical: vs(10),
  },
});
