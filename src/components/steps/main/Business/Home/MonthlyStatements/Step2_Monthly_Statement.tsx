/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useBusinessDetails } from '@/store/selectors/business/business';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { renderItem } from '@src/components/commons/HomeTransactions';
import PortalBottomSheet from '@src/components/globals/PortalBottomSheet';
import { PortalBottomSheetRef } from '@src/components/globals/PortalBottomSheet/types';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import TransactionSummary from '@src/components/globals/TransactionSummary';
import Colors from '@src/constants/Colors';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { vs } from '@utils/design/design';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { HomeProps } from '../type';

interface step2Props extends HomeProps {
  statementData: any;
}
const Step2_Monthly_Statement = ({
  statementData,
  parentGoto,
  back,
}: step2Props) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const [transDetails, setTransDetails] = useState(null);
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };
  const bottomSheetRef2 = useRef<BottomSheet>(null);

  return (
    <ScreenAuth
      title="Statements"
      style={{
        backgroundColor: Colors.light.theme.backgroundTopCurveSection,
      }}
      topColor={Colors.light.theme.backgroundTopCurveSection}
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        back?.();
      }}
    >
      <FlatList
        key="Statements"
        data={statementData?.data?.data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(100) }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.transStyle}
            onPress={() => {
              openBottomSheet();
              setTransDetails(item);
            }}
          >
            {renderItem({ item, activeCurrency: businessData?.activeCurrency })}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `businesss-${item.label}-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No Data Found</Text>}
      />
      <PortalBottomSheet
        ref={bottomSheetRef}
        snapPoints={['55%']}
        handleComponent={undefined}
        enableContentPanningGesture
        enableHandlePanningGesture
        handleIndicatorStyle={{
          backgroundColor: 'black',
        }}
        TouchComponent={() => <></>}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={() => bottomSheetRef.current?.close()}
          />
        )}
      >
        <TransactionSummary
          transactionDetails={transDetails}
          activeCurrency={businessData?.activeCurrency}
        />
      </PortalBottomSheet>
    </ScreenAuth>
  );
};

export default Step2_Monthly_Statement;

const styles = StyleSheet.create({
  transStyle: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
});
