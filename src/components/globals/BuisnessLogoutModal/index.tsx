/* eslint-disable import/order */
import useBusinessLogout from "@src/hooks/useBusinessLogout";
import { globalStyle } from "@src/styles/globals";
import { hs, ms, vs } from "@utils/design/design";
import React, { useRef } from "react";
// eslint-disable-next-line prettier/prettier
// import { useBuisnessSignoutMutation } from '@/store/api/business/authApis';
import LogoutIcon from "@assets/icons/logout.svg";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../Button";
import PortalBottomSheet from "../PortalBottomSheet";
import { PortalBottomSheetRef } from "../PortalBottomSheet/types";

// Main GlobalLogout Component
const BusinessLogoutModal: React.FC<{ marginTop: number; icon?: any }> = ({
  marginTop,
  icon,
}) => {
  const { handleBusinessLogout } = useBusinessLogout();
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          ...globalStyle.whiteRoundedCard,
          backgroundColor: "#F2F2F2",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: hs(16),
          borderRadius: ms(10),
          paddingRight: hs(8),
          paddingTop: vs(20),
          paddingBottom: vs(20),
          width: "94%",
          alignSelf: "center",
          marginTop,
          marginLeft: hs(0),
        }}
        onPress={openSheet}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image source={icon} style={{ width: 26, height: 26 }} />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Excon-Medium",
              fontSize: ms(14),
              color: "black",
            }}
          >
            Logout
          </Text>
        </View>
        <AntDesign name="right" size={20} color="gray" />
      </TouchableOpacity>
      {/* Logout confirmation modal */}
      <PortalBottomSheet
        ref={bottomSheetRef}
        snapPoints={Platform.OS === "ios" ? ["50%"] : ["48%"]}
        handleComponent={undefined}
        backgroundStyle={{ backgroundColor: "#e8eaec" }}
        handleIndicatorStyle={{
          backgroundColor: "#c2c3c4",
        }}
        enableContentPanningGesture
        enableHandlePanningGesture
        TouchComponent={() => <></>}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={closeSheet}
          />
        )}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: "center",
              marginTop: vs(15),
              marginBottom: vs(10),
            }}
          >
            <LogoutIcon />
          </View>
          <Text style={styles.modalText}>
            Are you sure you want to log out?
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              btnTitleColor="black"
              btnTitle="No"
              onClick={closeSheet}
              btnColor="#c9cacc"
            />
            <Button
              btnTitle="Yes"
              loading={false}
              onClick={handleBusinessLogout}
              btnColor="#f41a2c"
              btnTitleColor="white"
            />
          </View>
        </View>
      </PortalBottomSheet>
    </View>
  );
};

// Modal styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalText: {
    width: "75%",
    fontSize: ms(24),
    textAlign: "center",
    marginBottom: Platform.OS === "ios" ? vs(20) : vs(40),
    fontFamily: "Excon-Medium",
    color: "#030302cc",
    alignSelf: "center",
  },
  buttonContainer: {
    alignSelf: "center",
    width: "80%",

    gap: vs(20),
  },
});

export default BusinessLogoutModal;
