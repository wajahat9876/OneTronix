/* eslint-disable @typescript-eslint/no-unused-vars */
import SetNoPermission from '@src/components/globals/SetNoPermission';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

const PermissionModal = ({
  showModal,
  setShowModal,
  title,
  setPermission,
  type,
}: any) => {
  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalContainer}>
        <SetNoPermission
          type={type}
          setHasPermission={setPermission}
          title={title}
          onPermissionGranted={() => setShowModal(false)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal background
  },
});

export default PermissionModal;
