/* eslint-disable import/order */
import { MaterialIcons } from "@expo/vector-icons";
import useBusinessLogout from "@src/hooks/useBusinessLogout";
import { globalStyle } from "@src/styles/globals";
import { hs, ms, vs } from "@utils/design/design";
import React, { useState } from "react";
// eslint-disable-next-line prettier/prettier
// import { useBuisnessSignoutMutation } from '@/store/api/business/authApis';
import LogoutIcon from "@assets/icons/eccLogoutIcon.svg";
import { useAppDispatch } from "@src/hooks/useReduxHooks";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../Button";
// Global Logout Modal Component
const LogoutModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ isVisible, onClose, onConfirm, isLoading }) => (
  <Modal
    transparent
    animationType="fade"
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <LogoutIcon style={{ marginBottom: getRespValue(15) }} />
        <Text style={styles.modalText}>Are you sure you want to log out?</Text>
        <View style={styles.buttonContainer}>
          <Button
            btnTitle="Yes"
            btnTitleColor="white"
            loading={isLoading}
            onClick={onConfirm}
            btnColor="#000000"
            disabled={isLoading}
          />
          <Button
            btnTitleColor="black"
            btnTitle="No"
            onClick={onClose}
            btnColor="#F8F9FE"
          />
        </View>
      </View>
    </View>
  </Modal>
);

// Main GlobalLogout Component
const BusinessLogoutModal: React.FC<{ marginTop: number; icon?: any }> = ({
  marginTop,
  icon,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { handleBusinessLogout } = useBusinessLogout();
  const dispatch = useAppDispatch();

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const router = useRouter();
  return (
    <View>
      <TouchableOpacity
        style={{
          ...globalStyle.whiteRoundedCard,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: hs(16),
          borderRadius: ms(6),
          paddingRight: hs(8),
          paddingTop: vs(8),
          paddingBottom: vs(8),
          width: "93%",
          alignSelf: "center",
          marginTop,
          marginLeft: hs(0),
        }}
        onPress={handleLogoutPress}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image source={icon} style={{ width: 26, height: 26 }} />
          <Text
            style={{ ...globalStyle.textMedium, fontSize: 17, color: "black" }}
          >
            Logout
          </Text>
        </View>
        <MaterialIcons name="arrow-right" size={42} color="black" />
      </TouchableOpacity>
      {/* Logout confirmation modal */}
      <LogoutModal
        isLoading={false}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={() => {
          handleBusinessLogout();
        }}
      />
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
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Excon-Regular",
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default BusinessLogoutModal;
