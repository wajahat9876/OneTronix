/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useGetMulticurrencyTransactionQuery,
  useGetTargetedTransactionQuery,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { renderItem } from '@src/components/commons/HomeTransactions';
import PortalBottomSheet from '@src/components/globals/PortalBottomSheet';
import { PortalBottomSheetRef } from '@src/components/globals/PortalBottomSheet/types';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import TransactionSummary from '@src/components/globals/TransactionSummary';
import Colors from '@src/constants/Colors';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const Step0_TransactionHistory = () => {
  const isFocused = useIsFocused();
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const router = useRouter();
  const [transactions, setTransactions] = useState<any>([]);
  const [transDetails, setTransDetails] = useState(null);

  const { data, isFetching, refetch } = useGetTargetedTransactionQuery({
    pageNo: 1,
    pageSize: 1000,
  });

  const {
    data: multiData,
    isFetching: multiFetching,
    refetch: multiRefetch,
  } = useGetMulticurrencyTransactionQuery({
    pageNo: 1,
    pageSize: 1000,
  });

  useEffect(() => {
    if (isFocused) {
      bottomSheetRef2?.current?.close();
      const fetchTransactions = async () => {
        if (businessData?.activeCurrency === 1) {
          await refetch();
          setTransactions(data?.data);
        } else {
          await multiRefetch();
          setTransactions(multiData?.data);
        }
      };
      fetchTransactions();
    } else {
      setTransactions([]); // Reset data when leaving the screen
    }
  }, [isFocused, refetch, multiRefetch, data, multiData]);

  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };
  const bottomSheetRef2 = useRef<BottomSheet>(null);

  return (
    <ScreenAuth
      title="Transaction History"
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
        router.replace('/(main)/Business/Home');
      }}
    >
      <FlatList
        key="transactions"
        data={transactions}
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
        keyExtractor={(item, index) => `busines-${item.id}-${index}`}
        ListEmptyComponent={() =>
          !isFetching && !multiFetching ? (
            <Text style={styles.emptyText}>No Transaction Found</Text>
          ) : (
            <>
              <ActivityIndicator size="small" color="blue" />
            </>
          )
        }
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

export default Step0_TransactionHistory;

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
