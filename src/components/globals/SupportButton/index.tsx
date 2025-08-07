/* eslint-disable react/require-default-props */
/* eslint-disable import/order */
import ContactIcon from '@assets/icons/SupportBlack.svg';
import ContactWhiteIcon from '@assets/icons/Supportwhite.svg';
// eslint-disable-next-line prettier/prettier
import {
  SafeAreaView,
  TouchableOpacity
} from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { renderToastError } from '@src/hooks/useToasty';
import React, { memo, useCallback, useRef } from 'react';
import { StatusBar } from 'react-native';
import PortalBottomSheet from '../PortalBottomSheet';
import { PortalBottomSheetRef } from '../PortalBottomSheet/types';

interface SupportButtonProps {
  light?: boolean;
}
const SupportButton = ({ light }: SupportButtonProps) => {
  const [, setReady] = React.useState(false);
  // const [busTrigger, { isFetching: businessFetching }] =
  //   useLazyHubSpotBuisnessQuery();

  // const isKeyboardVisible = useKeyboardCheck();
  // const [link, setLink] = useState(null);
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
    setTimeout(() => {
      setReady(true);
    }, 5000);
  };
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setReady(false);
  };
  const handleSupport = useCallback(async () => {
    try {
      // const res = await busTrigger({}).unwrap();
      // setLink(res?.results?.URL);
      openBottomSheet();
    } catch (error: any) {
      renderToastError('Service temporary unavailable');
      closeBottomSheet();
    }
  }, []);

  return (
    <>
      <TouchableOpacity onPress={handleSupport}>
        {light ? <ContactIcon /> : <ContactWhiteIcon />}
      </TouchableOpacity>
      <PortalBottomSheet
        // eslint-disable-next-line react/jsx-no-useless-fragment
        TouchComponent={() => <></>}
        handleIndicatorStyle={{ backgroundColor: 'white' }}
        backgroundStyle={{
          backgroundColor: Colors.light.theme.backgroundTopCurveSection,
        }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['100%']}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar barStyle="dark-content" />
          {/* {link && (
            <KeyboardAvoidingView
              enabled
              style={isKeyboardVisible ? { height: '55%' } : { flex: 1 }}
            >
              <Pressable
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 10,
                  backgroundColor: 'transparent',
                  zIndex: 1000,
                  padding: 10,
                  opacity: 0,
                  width: '22%',
                }}
                onPress={() => {
                  closeBottomSheet();
                }}
              >
                <Text style={{ fontSize: 30, color: 'white' }}>X</Text>
              </Pressable>
              {!ready && <LoadingModal isLoading />}
              <WebView
                containerStyle={{ flex: 1 }}
                source={{
                  uri: `${link}`,
                }}
                // startInLoadingState
                // renderLoading={() => <LoadingModal isLoading />}
              />
            </KeyboardAvoidingView>
          )} */}
          <SafeAreaView
            edges={['bottom']}
            style={{
              backgroundColor: 'white',
            }}
          />
        </SafeAreaView>
      </PortalBottomSheet>
    </>
  );
};

export default memo(SupportButton);
