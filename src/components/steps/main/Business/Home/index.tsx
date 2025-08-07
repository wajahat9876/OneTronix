/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
// import PhoneInput from '@src/components/globals/PhoneInput';
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import {
  useChangeActiveBusinessCurrencyMutation,
  useGetMulticurrencyTransactionQuery,
  useGetTargetedTransactionQuery,
  useLazyGetMultiPayeeQuery,
  useLazyGetPayeeQuery,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import MonthlyStatementIcon from '@assets/BankStatement/Monthly Statement.svg';
import IconBankTransfer from '@assets/icons/home-screen/icon-bank-transfer.svg';
import IocnBankStatement from '@assets/icons/home-screen/icon-request-money.svg';
import IconTransactionHistory from '@assets/icons/home-screen/icon-transaction-history.svg';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { renderItem } from '@src/components/commons/HomeTransactions';
import FrequentUseItem from '@src/components/commons/main/home_stack/FrequentUseItem';
import HomeBalanceDisplay from '@src/components/globals/HomeBalanceDisplay';
import HomeCardBackgroundImage from '@src/components/globals/HomeCardBackgroundimage';
import HomeCurrencyChangeModal from '@src/components/globals/HomeCurrencyChangeModal';
import LoadingModal from '@src/components/globals/LoadingModal';
import PortalBottomSheet from '@src/components/globals/PortalBottomSheet';
import { PortalBottomSheetRef } from '@src/components/globals/PortalBottomSheet/types';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import TransactionSummary from '@src/components/globals/TransactionSummary';
import { StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { useFocusEffect, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated from 'react-native-reanimated';

const Index = ({ goTo }: MultiStepFormProps) => {
  const router = useRouter();
  const [transDetails, setTransDetails] = useState<any>();
  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);
  const [show, setShow] = useState(false);
  const { getCurrencyCode } = useCurrencyFlag();
  const {
    refetch: currentFetch,
    isFetching: currentFetching,
    data,
  } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const [changeActiveCurrency, { isLoading }] =
    useChangeActiveBusinessCurrencyMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [trigger, isFetching] = useLazyGetPayeeQuery();
  const [multiTrigger] = useLazyGetMultiPayeeQuery();
  const {
    data: transactionData,
    isLoading: transLoading,
    refetch: transactionRefetch,
  } = useGetTargetedTransactionQuery(
    {
      pageNo: 1,
      pageSize: 10,
    },
    { refetchOnMountOrArgChange: true },
  );
  const {
    data: multiTransactionData,
    isLoading: multiTransLoading,
    refetch: multiTransactionRefetch,
  } = useGetMulticurrencyTransactionQuery(
    {
      pageNo: 1,
      pageSize: 10,
    },
    { refetchOnMountOrArgChange: true },
  );
  useEffect(() => {
    if (auth_token) {
      if (businessData?.activeCurrency === 1) {
        transactionRefetch();
        trigger({});
      } else {
        multiTransactionRefetch();
        multiTrigger({});
      }

      setTimeout(() => {
        setShow(true);
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth_token]);
  const bottomSheetRef = useRef<PortalBottomSheetRef>(null);
  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.open();
  };
  const [, setBottomSheetVisible] = useState(false);
  // 2ndBototmSheet for Currency
  const currencyModalRef = useRef<BottomSheet>(null);
  const closeCurrencySheet = () => {
    setBottomSheetVisible(false);
    currencyModalRef.current?.close();
  };
  const openCurrencySheet = () => {
    setBottomSheetVisible(true);
    currencyModalRef.current?.expand();
  };
  const currencyPoints = useMemo(() => ['70%'], []);

  const handleActive = async (item: any) => {
    try {
      const res = await changeActiveCurrency({
        currencyCode: item,
      }).unwrap();
      if (res) {
        if (item === 1) {
          transactionRefetch();
          trigger({});
        } else {
          multiTrigger({});
          multiTransactionRefetch();
        }
        renderToastSuccess(res?.message || 'Succesfully Changed');
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  // To show only active Currencies
  const activeCurrencies =
    businessData?.multiCurrencyAccounts?.filter(
      item => item.active && item.approved,
    ) || [];
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content', true);
      return () => {
        StatusBar.setBarStyle('dark-content', true);
      };
    }, []),
  );
  const handleRefresh = () => {
    if (businessData?.activeCurrency === 1) {
      transactionRefetch();
    } else {
      multiTransactionRefetch();
    }
  };
  return (
    <Animated.View {...pageTransitionAnimation} key="home" className="flex-1">
      <ScreenAuth
        title=""
        style={{
          backgroundColor: 'transparent',
        }}
        topColor="transparent"
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus={false}
        disableTopSafeArea
        appBarProps={{
          light: false,
        }}
        disableAppBar
        back={() => {}}
      >
        <View style={styles.container}>
          {/* header section */}
          <View style={styles.topHeader}>
            <HomeCardBackgroundImage />
            <HomeBalanceDisplay
              name={businessData?.businessnName}
              activeCurrencyBalance={businessData?.accountBalance}
              key="HomeBalanceDisplays"
              sign={getCurrencyCode(businessData?.activeCurrency)}
              openCurrencyChangeModal={openCurrencySheet}
              accountNumber={businessData?.accountNumber}
              data={businessData}
            />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={transLoading}
                onRefresh={() => handleRefresh()}
                tintColor="blue"
              />
            }
          >
            {/* body section */}
            <View className="mx-4 mt-4">
              <View
                style={{ flexDirection: 'row', gap: hs(16), marginTop: vs(10) }}
              >
                <FrequentUseItem
                  title={`Bank\nTransfer`}
                  color="#FFC63314"
                  icon={<IconBankTransfer />}
                  onClick={() => {
                    router.push('/(main)/Business/TransferMoney');
                  }}
                />
                <FrequentUseItem
                  title={`E-\nStatement`}
                  color="#3642DA14"
                  icon={<IocnBankStatement />}
                  onClick={() => {
                    goTo?.(2);
                  }}
                />
                <FrequentUseItem
                  title={`Transaction\nHistory`}
                  color="#DA36CA14"
                  icon={<IconTransactionHistory />}
                  onClick={() => {
                    router.push('/(main)/Business/Transaction');
                  }}
                />
                <FrequentUseItem
                  title={`Monthly\nStatement`}
                  color="#E1F8DC"
                  icon={<MonthlyStatementIcon />}
                  onClick={() => {
                    goTo?.(3);
                  }}
                />
              </View>
            </View>
            {!show && (
              <ActivityIndicator style={{ marginTop: vs(20) }} color="black" />
            )}
            {show && (
              <View>
                {businessData?.activeCurrency === 1 && (
                  <View>
                    {transactionData?.data?.length > 0 ? (
                      <Text
                        style={{
                          ...globalStyle.textMedium,
                          fontSize: 17,
                          marginLeft: getRespValue(20),
                          marginBottom: getRespValue(20),
                          marginTop: getRespValue(20),
                        }}
                      >
                        Recent Transactions
                      </Text>
                    ) : (
                      <Text
                        style={{
                          ...globalStyle.textMedium,
                          fontSize: 17,
                          marginLeft: getRespValue(20),
                          marginBottom: getRespValue(20),
                          marginTop: getRespValue(40),
                          alignSelf: 'center',
                          color: 'gray',
                        }}
                      >
                        No Transaction Found
                      </Text>
                    )}
                  </View>
                )}
                {businessData?.activeCurrency !== 1 && (
                  <View>
                    {multiTransactionData?.data?.length > 0 ? (
                      <Text
                        style={{
                          ...globalStyle.textMedium,
                          fontSize: 17,
                          marginLeft: getRespValue(20),
                          marginBottom: getRespValue(20),
                          marginTop: getRespValue(20),
                        }}
                      >
                        Recent Transactions
                      </Text>
                    ) : (
                      <Text
                        style={{
                          ...globalStyle.textMedium,
                          fontSize: 17,
                          marginLeft: getRespValue(20),
                          marginBottom: getRespValue(20),
                          marginTop: getRespValue(40),
                          alignSelf: 'center',
                          color: 'gray',
                        }}
                      >
                        No Transaction Found
                      </Text>
                    )}
                  </View>
                )}
                <FlatList
                  key="opa333"
                  data={
                    businessData?.activeCurrency === 1
                      ? transactionData?.data
                      : multiTransactionData?.data
                  }
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingBottom: vs(100) }}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.transactionsCard}
                        onPress={() => {
                          openBottomSheet();
                          setTransDetails(item);
                        }}
                      >
                        {renderItem({
                          item,
                          activeCurrency: businessData?.activeCurrency,
                        })}
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => `business-${item.id}-${index}`}
                />
              </View>
            )}
          </ScrollView>
        </View>
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
          <TransactionSummary
            transactionDetails={transDetails}
            activeCurrency={businessData?.activeCurrency}
          />
        </PortalBottomSheet>
        <HomeCurrencyChangeModal
          bottomSheetRef={currencyModalRef}
          snapPoints={currencyPoints}
          data={activeCurrencies}
          onClose={closeCurrencySheet}
          onSelect={handleActive}
          onCreateAccount={() => goTo?.(1)}
          activeCurrency={getCurrencyCode(businessData?.activeCurrency)}
        />
        <LoadingModal isLoading={isLoading} />
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderCurve: 'circular',
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#f9f9f9',
  },
  topHeader: {
    backgroundColor: 'black',
    height: '41%',
    overflow: 'hidden',
    borderBottomLeftRadius: ms(42),
    borderBottomRightRadius: ms(42),
  },
  viewTrans: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: 'space-between',
  },
  directionTxt: {
    color: 'black',
    fontWeight: '400',
    fontSize: getRespValue(16),
  },
  txtAccount: {
    color: 'black',
    fontWeight: '600',
    width: '70%',
    fontSize: getRespValue(16),
  },
  txtTrans: { color: 'black', fontWeight: '600', fontSize: getRespValue(16) },
  transactionsCard: {
    marginLeft: 10,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 10,
  },
});
export default Index;
