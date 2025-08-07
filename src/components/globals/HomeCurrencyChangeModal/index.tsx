/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Blacktick from '@assets/images/blackTick.png';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import React, { forwardRef } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ScreenAuth from '../ScreenAuth';

interface Homeee {
  data: any;
  snapPoints: any;
  onSelect: any;
  onCreateAccount: any;
  onClose: any;
  bottomSheetRef: any;
  activeCurrency?: any;
}
const HomeCurrencyChangeModal = forwardRef(
  ({
    data,
    snapPoints,
    onSelect,
    onCreateAccount,
    onClose,
    activeCurrency,
    bottomSheetRef,
  }: Homeee) => {
    const { getFlagImage, getCurrencyNumber } = useCurrencyFlag();
    const active = activeCurrency;

    return (
      <BottomSheet
        handleIndicatorStyle={{ backgroundColor: 'white' }}
        backgroundStyle={styles.bottomSheet}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(
          props, // Custom backdrop to handle press
        ) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={() => bottomSheetRef.current?.close()}
          />
        )}
      >
        <ScreenAuth
          title="Create Currency"
          style={{
            backgroundColor: 'transparent',
          }}
          topColor="transparent"
          disableTopSafeArea
          bottomColor={Colors.light.theme.backgroundTopCurveSection}
          appBarProps={{
            light: true,
            rightIcon: true,
          }}
          back={() => {
            onClose();
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity onPress={onCreateAccount} style={styles.Create}>
              <Text style={styles.createTxt}>Add New Currency</Text>
            </TouchableOpacity>
            {/* List of Items */}
            <FlatList
              data={data}
              contentContainerStyle={{ paddingBottom: 20 }}
              scrollEnabled
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.Card}
                  onPress={() => {
                    onSelect(getCurrencyNumber(item?.currencyCode));
                    onClose();
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      {item.currencyCode && (
                        <Image
                          source={getFlagImage(item.currencyCode)}
                          style={{ width: 20, height: 20, margin: 2 }}
                        />
                      )}
                      <Text
                        style={{ fontSize: 16, marginLeft: 5, color: 'black' }}
                      >
                        {item.currencyCode}
                      </Text>
                    </View>
                    {active === item?.currencyCode && (
                      <Image
                        style={{ width: 15, height: 15 }}
                        source={Blacktick}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        </ScreenAuth>
      </BottomSheet>
    );
  },
);

// Export the component as default
export default HomeCurrencyChangeModal;
const styles = StyleSheet.create({
  Card: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    padding: 15,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 20,
    justifyContent: 'center',
  },
  createTxt: {
    padding: 5,
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'center',
  },
  Create: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    width: '80%',
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 20,
    justifyContent: 'center',
  },
  bottomSheet: {
    borderCurve: 'circular',
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#f9f9f9',
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
});
