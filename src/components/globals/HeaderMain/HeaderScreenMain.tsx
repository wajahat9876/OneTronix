/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChangeActiveInverterMutation } from "@/store/api/business/mainApis";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BellIcon from "@assets/icons/bell.png"; // your SVG bell icon
import Colors from "@src/constants/Colors";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { hs, ms, vs } from "@utils/design/design";
import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import DropdownRNE from "../DropdownRNE";
interface GlobalHeaderProps {}

const GlobalHeaderMain = (props: GlobalHeaderProps) => {
  const [changeInverter, { isLoading }] = useChangeActiveInverterMutation();
  const {} = props;
  const { data } = useAppSelector(useBusinessDetails);

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
            />
          )}
        </View>

        {/* RIGHT: Bell Icon */}
        <View style={{ width: "75%" }}>
          {loading || isLoading ? (
            <ActivityIndicator size="small" color={"red"} />
          ) : (
            <DropdownRNE
              dropdownPosition="bottom"
              dropdownType="custom"
              data={[]}
              value={activeInverter}
              labelField="label"
              valueField="value"
              placeholder=""
              minHeight={200}
              onChange={() => {}}
              containerStyle={{
                width: 120,
              }}
              style={{
                width: "40%",
                borderColor: "gray",
                borderRadius: 8,
                height: vs(40),
                paddingHorizontal: hs(10),
                backgroundColor: "transparent",
                marginLeft: -20,
              }}
              renderRightIcon={() => (
                <Image source={BellIcon} style={{ width: 25, height: 25 }} />
              )}
              renderLeftIcon={() => {}}
              selectedTextStyle={{
                fontSize: ms(0),
                fontFamily: "Excon-Regular",
                color: "transparent",
              }}
              itemTextStyle={{
                fontSize: ms(13),
                fontFamily: "Excon-Regular",
                color: Colors.light.theme.black,
              }}
              placeholderStyle={{
                color: "transparent",
              }}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default memo(GlobalHeaderMain);
