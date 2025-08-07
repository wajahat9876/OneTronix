/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useChangeActiveBusinessCurrencyMutation } from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Blacktick from '@assets/images/blackTick.png';
import Buttons from '@src/components/globals/Buttons';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SettingProps } from '../type';

const Accounts = ({ next,parentGoto }: SettingProps) => {
  const { data: businessData, auth_token } = useAppSelector(useBusinessDetails);
 const {refetch,isFetching}=useGetCurrentBusinessQuery(undefined,{skip:!auth_token})
  const active = businessData?.activeCurrency;
  const [changeActiveCurrency, { isLoading }] =
    useChangeActiveBusinessCurrencyMutation();
    const {getFlagImage }=useCurrencyFlag()
  const handleActive = async (item: any) => {
    try {
      const res = await changeActiveCurrency({
        currencyCode: item?.currencyCode,
      }).unwrap();
      renderToastSuccess(res?.message|| 'Succesfully Changed')
    } catch (error: any) {
      renderToastError(error?.data?.message);
    }
  };
  const activeCurrencies = businessData?.multiCurrencyAccounts?.filter(item => item.active) || [];
  return (
    <ScreenAuth
      title="Accounts"
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
      back={() => {parentGoto?.(0)}}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select Currency</Text>
        <Buttons buttonType='simple' light onPress={()=>{  next?.();}} >Create New</Buttons>
      {isFetching && <ActivityIndicator size="small" color="blue" />}
        <FlatList
          data={activeCurrencies}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => refetch()}
              tintColor="blue"
            />
          }
          renderItem={({ item }) => {
            return (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.Card}
                  onPress={() => handleActive(item)}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{flexDirection:'row'}}>
                   <Image style={{width:20,height:20}} source={getFlagImage(item?.currencyCode)} />
                    <Text style={{ paddingLeft: 5, fontSize: 16 }}>
                      {item?.currencyCode}
                    </Text>
                    </View>
                    {active === item?.currencyCode && (
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={Blacktick}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {isLoading && (
        <Modal transparent visible={isLoading} animationType="fade">
          <View style={styles.loaderContainer}>
            <View style={styles.loaderBackground} />
            <ActivityIndicator size="large" color='White' />
          </View>
        </Modal>
      )}
    </ScreenAuth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  Card: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation:Platform.OS==='ios' ?2:0,
    marginBottom: 20,
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slight blur effect
  },
  loaderBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Background for blur effect
  },
});

export default Accounts;
