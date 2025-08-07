/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable no-nested-ternary */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import { businessQrSignin } from '@/store/slices/business/businessSlice';
import CloseIcon from '@assets/icons/CloseWhite.png';
import cameraOutline from '@assets/icons/user/qr/camera-outline.png';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '@src/components/globals/Buttons';
import SetNoPermission from '@src/components/globals/SetNoPermission';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError } from '@src/hooks/useToasty';
import { getRespValue } from '@utils/getRespValue';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useDispatch } from 'react-redux';

interface ScanQr {
  bottomSheetRef: any;
  snapPoints: any;
  closeBottomSheet: () => void;
  active?: boolean;
}
const Step2ScanQr = React.memo((props: ScanQr) => {
  const { bottomSheetRef, snapPoints, closeBottomSheet, active } = props;
  const [hasPermission, setHasPermission] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { isLoading: currentLoading } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted' ? 'granted' : 'denied');
  };
  // useEffect(() => {
  //   requestPermissions();
  // }, [hasPermission]);
  // const bottomSheetRef2 = useRef<BottomSheet>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    const result = data.match(/"ecc"/g);
    if (result) {
      const obj = JSON.parse(data);
      console.log('this is onject', obj);
      if (obj?.type === 'ecc') {
        dispatch(businessQrSignin(obj?.accessToken));
        router.replace('/(auth)/KYC/Business');
        setScanned(true);
      }
    } else {
      renderToastError('Something went wrong');
      setScanned(true);
    }
  };

  return (
    <BottomSheet
      handleIndicatorStyle={{ backgroundColor: '#494949' }}
      backgroundStyle={styles.bottomSheet}
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
    >
      <View style={{ justifyContent: 'center', marginTop: 60 }}>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginBottom: 10 }}
          onPress={() => {
            closeBottomSheet();
            setScanned(false);
          }}
        >
          <Image
            source={CloseIcon}
            style={{ width: 20, height: 20, marginBottom: 5 }}
          />
        </TouchableOpacity>
        {hasPermission === null && !scanned ? (
          <TouchableOpacity onPress={() => requestPermissions()}>
            <Button
              buttonType="simple"
              buttonStyles={{
                marginTop: 50,
              }}
            >
              Start QR Scan
            </Button>
          </TouchableOpacity>
        ) : hasPermission === 'denied' ? (
          <SetNoPermission
            setHasPermission={setHasPermission}
            title="We need access to your camera to scan QR codes."
          />
        ) : (
          <View style={styles.container}>
            {active && (
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                  height: getRespValue(400),
                  width: getRespValue(400),
                }}
              >
                <Image
                  source={cameraOutline}
                  style={{
                    height: getRespValue(400),
                    width: getRespValue(400),
                    position: 'absolute',
                    zIndex: 1000,
                  }}
                />
              </CameraView>
            )}
            {!currentLoading && scanned && (
              <Button
                buttonType="simple"
                buttonStyles={{
                  width: getRespValue(307),
                  height: getRespValue(48),
                  borderRadius: 10,
                  backgroundColor: 'black',
                  marginTop: 10,
                }}
                onPress={() => {
                  setScanned(false);
                }}
              >
                Tap to Scan Again
              </Button>
            )}
          </View>
        )}
        {/* Close button for modal */}
      </View>
    </BottomSheet>
  );
});

export default Step2ScanQr;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  iconStyle: {
    height: 25,
    width: 25,
  },
  bottomSheet: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'black',
    padding: 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  cameraOverlay: {
    height: getRespValue(350),
    width: getRespValue(350),
    position: 'absolute',
    zIndex: 1000,
  },
});
