/* eslint-disable no-empty */
/* eslint-disable camelcase */
/* eslint-disable import/order */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import {
  useLazyGetMultiPayeeQuery,
  useLazyGetPayeeQuery,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import {
  resetBeneficiaryDetails,
  setBeneficiaryDetails,
  setShowToogle,
} from '@/store/slices/business/businessSlice';
import EditSvg from '@assets/icons/DeleteIcon.svg';
import CurrentBalanceCard from '@src/components/commons/main/card_stack/CurrentBalanceCard';
import RecentTransferItem from '@src/components/commons/main/card_stack/RecentTransferItem';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { StyleSheet, Text, TouchableOpacity } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppDispatch, useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
// eslint-disable-next-line prettier/prettier
import { FlatList, Platform, RefreshControl, View } from 'react-native';
import Animated from 'react-native-reanimated';

const Step0_Payee = ({ goTo, next }: MultiStepFormProps) => {
  const router = useRouter();
  const {
    getBusinessBeneficiary,
    data: businessData,
    auth_token,
  } = useAppSelector(useBusinessDetails);
  const [trigger, isFetching] = useLazyGetPayeeQuery();
  const [multiTrigger, multiLoading] = useLazyGetMultiPayeeQuery();
  const { refetch } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });

  const dispatch = useAppDispatch();
  //   const fetchBankAccounts = usePrefetch('getUserBenefBankAccounts');

  const handleBeneficiaryPress = (item: any) => {
    dispatch(setShowToogle(false));
    dispatch(setBeneficiaryDetails(item));
    next?.();
  };
  const handleRefresh = async () => {
    if (businessData?.activeCurrency === 1) {
      try {
        await trigger({}).unwrap();
      } catch (error) {}
    } else {
      try {
        await multiTrigger({}).unwrap();
      } catch (error) {}
    }
  };
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Pay & Transfer"
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
        <View style={styles.container}>
          <View className="px-4">
            <CurrentBalanceCard
              balance={businessData?.accountBalance}
              currency={businessData?.activeCurrency}
              onPress={() => refetch()}
            />
          </View>
          <TouchableOpacity
            style={{
              ...globalStyle.whiteRoundedCard,
              marginLeft: hs(24),
              marginRight: hs(24),
            }}
            onPress={() => {
              dispatch(resetBeneficiaryDetails());
              dispatch(setShowToogle(true));
              goTo?.(1);
            }}
          >
            <Text
              style={{
                ...globalStyle.textRegular,
                fontSize: 13,
                color: 'black',
              }}
            >
              Add New
            </Text>
          </TouchableOpacity>
          {getBusinessBeneficiary?.length > 0 ? (
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
                marginBottom: vs(10),
              }}
            >
              Recent Beneficiaries
            </Text>
          ) : (
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 17,
                marginTop: vs(24),
                marginBottom: vs(10),
                alignSelf: 'center',
              }}
            >
              No Beneficiaries Found
            </Text>
          )}

          <FlatList
            data={getBusinessBeneficiary}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching.isLoading || multiLoading.isLoading}
                onRefresh={() => handleRefresh()}
                tintColor="blue"
              />
            }
            renderItem={({ item, index }) => {
              const marginTop = index === 0 ? 32 : 0;
              return (
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 8,
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleBeneficiaryPress(item);
                    }}
                  >
                    <RecentTransferItem
                      name={item?.name || item?.payeeName}
                      date={
                        item?.accountNumber || item?.accountNo || item?.iban
                      }
                      time={item?.contact?.phone || ' '}
                      // amount={item.amount}
                      marginTop={marginTop}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleBeneficiaryPress(item);
                      goTo?.(6);
                    }}
                  >
                    <EditSvg width={hs(25)} height={vs(25)} marginTop={10} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: hs(16),
    paddingRight: hs(16),
  },
  currentBalanceContainer: {
    alignItems: 'center',
    backgroundColor: Colors.light.theme.backgroundColorCurrentBalanceContainer,
    borderRadius: ms(24),
    marginTop: vs(16),
    paddingTop: vs(16),
    paddingBottom: vs(16),
    paddingLeft: hs(56),
    paddingRight: hs(56),
  },
  editCard: {
    backgroundColor: '#EAE9E8',
    borderRadius: 8,
    height: '70%',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginTop: 10,
    marginLeft: -10,
  },
});
export default Step0_Payee;
