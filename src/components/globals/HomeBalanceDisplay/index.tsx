/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ArrowDown from '@assets/icons/arrowDownWhite.png';
import ImgAppLogo from '@assets/icons/home-screen/ecc-home-screen-logo.svg';
import Colors from '@src/constants/Colors';
import useCapitalizeFirstWord from '@src/hooks/useCapitalizeFirst';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import useExtractSortCode from '@src/hooks/useExtractSortCode';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { getAmountSize } from '@utils/helpers/resizeText';
import React, { useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PortalBottomSheet from '../PortalBottomSheet';
import { PortalBottomSheetRef } from '../PortalBottomSheet/types';

interface IHomeBalanceCardProps {
  name: string;
  activeCurrencyBalance: number | undefined;
  sign?: any;
  openCurrencyChangeModal: () => void;
  accountNumber?: string;
  data?: any;
}
const HomeBalanceDisplay = (props: IHomeBalanceCardProps) => {
  const {
    name,
    activeCurrencyBalance,
    openCurrencyChangeModal,
    sign,
    data,
    accountNumber,
  } = props;
  const { top } = useSafeAreaInsets();
  const { getFlagImage, getCurrencySymbol } = useCurrencyFlag();
  const { capitalizeEachWord } = useCapitalizeFirstWord();
  const { extractSortCode } = useExtractSortCode();
  const snapPoints = useMemo(() => ['100%'], []);
  const [, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  return (
    <>
      {/* <EasyEmoneyGradient /> */}
      <View style={{ paddingTop: top }}>
        <View
          style={{ paddingHorizontal: hs(24), paddingVertical: vs(8) }}
          className="flex-row justify-between items-center"
        >
          <ImgAppLogo />
          {getFlagImage(sign) && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
              onPress={openCurrencyChangeModal}
            >
              <Image
                source={getFlagImage(sign)}
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: getRespValue(190),
                  marginRight: 2,
                }}
              />
              <Text style={{ color: 'white', padding: 3, fontSize: 12 }}>
                {sign}
              </Text>
              <Image source={ArrowDown} />
            </TouchableOpacity>
          )}
          {/* <View style={{ marginLeft: getRespValue(10) }}>
            <SupportButton light={false} />
          </View> */}
        </View>
        <View style={{ paddingHorizontal: hs(24), marginTop: vs(5) }}>
          <View>
            <Text
              style={{
                ...globalStyle.textRegular,
                fontSize: getRespValue(30),
                color: Colors.light.theme.white,
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                ...globalStyle.textRegular,
                marginTop: 1,
                fontSize: getAmountSize(name?.length),
                color: Colors.light.theme.white,
              }}
            >
              {capitalizeEachWord(name)}
            </Text>
          </View>

          {/* Account type */}
          {data?.activeCurrency === 1 ? (
            <>
              <Text
                style={{
                  fontSize: getRespValue(19),
                  color: 'white',
                  opacity: 0.7,
                }}
              >
                {accountNumber}
              </Text>
              <Text
                style={{
                  fontSize: getRespValue(19),
                  color: 'white',
                  opacity: 0.7,
                }}
              >
                {extractSortCode(data?.activeCurrencyAccount?.[0]?.iban)}
              </Text>
            </>
          ) : (
            <Text
              style={{
                fontSize: ms(14),
                color: 'white',
                opacity: 0.7,
              }}
            >
              {data?.activeCurrencyAccount?.[0]?.iban}
            </Text>
          )}

          <Text
            style={{
              fontFamily: 'poppins',
              fontSize: ms(14),
              opacity: 0.7,
              color: Colors.light.theme.white,
            }}
          >
            Min Mandate Balance: {getCurrencySymbol(sign)}{' '}
            {data?.minMandateActiveCurrency}
          </Text>
          {/* Currency Symbol */}
          <View className="flex-row my-1">
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 28,
                color: Colors.light.theme.white,
              }}
            >
              {getCurrencySymbol(sign)}{' '}
            </Text>
            <Text
              style={{
                ...globalStyle.textSemibold,
                fontSize: 28,
                color: Colors.light.theme.white,
              }}
            >
              {activeCurrencyBalance === undefined
                ? 'Loading...'
                : Number(activeCurrencyBalance ?? 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      {/* for hubSpot (webChat) */}
      <PortalBottomSheet
        TouchComponent={() => <></>}
        handleIndicatorStyle={{ backgroundColor: 'white' }}
        backgroundStyle={{
          backgroundColor: Colors.light.theme.backgroundTopCurveSection,
        }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            marginVertical: 100,
          }}
          onPress={closeBottomSheet}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </PortalBottomSheet>
    </>
  );
};

export default HomeBalanceDisplay;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    opacity: 0.8,
  },
  closeButton: {
    backgroundColor: '#000F6D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  refreshIcon: {
    width: 15,
    height: 15,
    marginTop: 20,
    marginLeft: 10,
  },
  bottomSheet: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    borderCurve: 'circular',
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#f9f9f9',
  },
});
