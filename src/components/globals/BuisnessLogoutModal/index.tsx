/* eslint-disable import/order */
import { MaterialIcons } from '@expo/vector-icons';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import React, { useState } from 'react';
// eslint-disable-next-line prettier/prettier
// import { useBuisnessSignoutMutation } from '@/store/api/business/authApis';
import { useBuisnessSignoutMutation } from '@/store/api/business/authApis';
import LogoutIcon from '@assets/icons/eccLogoutIcon.svg';
import { renderToastError } from '@src/hooks/useToasty';
import { getRespValue } from '@utils/getRespValue';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../Button';
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
const BusinessLogoutModal: React.FC<{ marginTop: number }> = ({
  marginTop,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { handleBusinessLogout } = useBusinessLogout();

  const [businessSignout, { isLoading: businessLoading }] =
    useBuisnessSignoutMutation();

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await businessSignout({}).unwrap();
      handleBusinessLogout();
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          ...globalStyle.whiteRoundedCard,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: hs(16),
          paddingRight: hs(8),
          paddingTop: vs(8),
          paddingBottom: vs(8),
          marginTop,
          marginLeft: hs(0),
        }}
        onPress={handleLogoutPress}
      >
        <Text style={{ ...globalStyle.textMedium, fontSize: 15.34 }}>
          Logout
        </Text>
        <MaterialIcons name="arrow-right" size={42} color="black" />
      </TouchableOpacity>
      {/* Logout confirmation modal */}
      <LogoutModal
        isLoading={businessLoading}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </View>
  );
};

// Modal styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '85%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default BusinessLogoutModal;
