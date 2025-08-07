/* eslint-disable react/require-default-props */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */

import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Button from '../Button';

const SetNoPermission = ({
  setHasPermission,
  title,
  type,
  back,
  onPermissionGranted,
}: {
  setHasPermission: React.Dispatch<React.SetStateAction<string | null>>;
  back?: any;
  type?: boolean;
  title: string;
  onPermissionGranted?: () => void; // New prop
}) => {
  const handlePress = async () => {
    const { status, canAskAgain } =
      await Camera.requestCameraPermissionsAsync();
    if (status === 'granted' || canAskAgain)
      setHasPermission(status === 'granted' ? 'granted' : 'denied');
    if (status === 'granted' && onPermissionGranted) {
      onPermissionGranted(); // Call the callback if permission is granted
    } else {
      Linking.openSettings();
    }
  };
  const handleMediaPress = async () => {
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted' || canAskAgain) {
      setHasPermission(status === 'granted' ? 'granted' : 'denied');
    }
    if (status === 'granted' && onPermissionGranted) {
      onPermissionGranted(); // Call the callback if permission is granted
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      {back ? (
        <Button
          btnTitle="back"
          // buttonType="simple"

          onClick={() => {
            if (back) {
              back();
            }
          }}
        />
      ) : (
        ''
      )}
      <View
        style={{
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <MotiView
          key="createAccount"
          animate={{
            opacity: 1,
            translateY: 0,
            translateX: 0,
          }}
          from={{
            opacity: 0,
            translateX: -100,
          }}
          exit={{
            opacity: 0,
            translateX: -100,
          }}
          className="px-4 pt-4 pb-4 w-full"
        >
          <View style={{ alignItems: 'center', marginVertical: 100 }}>
            <Text
              style={{
                fontSize: 30,
                color: 'white',
              }}
              className="font-aeonik "
            >
              Please allow camera access
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'grey',
              }}
              className="font-aeonik pt-2 pb-2 w-5/5 text-[#000F6D]"
            >
              {title}
            </Text>
          </View>
        </MotiView>
        <Button
          btnTitle="Allow Permission"
          onClick={() => {
            if (type) {
              handleMediaPress();
            } else {
              handlePress();
            }
          }}
        />
      </View>
    </View>
  );
};
// SetNoPermission.defaultProps = {
//   back: null,
//   type: false,
// };
export default SetNoPermission;
// const styles = StyleSheet.create({});
const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '70%',
    backgroundColor: '#1A1A1A',
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: 10,
    alignSelf: 'center',
  },
});
