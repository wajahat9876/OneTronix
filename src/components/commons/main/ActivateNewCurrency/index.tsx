/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React from 'react';
// eslint-disable-next-line prettier/prettier
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

interface CurrencyData {
  code: string;
  flag: any;
}

interface CreateAccountProps {
  currencies: CurrencyData[];
  data: any;
  handleCreate: (currencyCode: string) => void;
  isLoading?: any;
  // disableCreated?: boolean; // Optional to disable already created currencies
}

const ActivateCurrency: React.FC<CreateAccountProps> = ({
  currencies,
  data,
  handleCreate,
  isLoading,
  // disableCreated = true,
}) => {
  const statusActive = (currencyCode: string) =>
    data?.multiCurrencyAccounts?.some(
      (account: any) =>
        account.currencyCode === currencyCode && account.active === true,
    );

  const statusApproved = (currencyCode: string) =>
    data?.multiCurrencyAccounts?.some(
      (account: any) =>
        account.currencyCode === currencyCode && account.approved === true,
    );

  const CurrencyExist = (currencyCode: string) =>
    data?.multiCurrencyAccounts?.some(
      (account: any) => account.currencyCode === currencyCode,
    );

  return (
    <FlatList
      data={currencies}
      keyExtractor={item => item.code}
      renderItem={({ item }) => {
        const isStatus = statusActive(item.code);
        const isApproved = statusApproved(item.code);
        const isExist = CurrencyExist(item.code);

        return (
          <TouchableOpacity
            style={[
              styles.Card,
              { backgroundColor: isExist ? '#F5F5F5' : 'white' },
            ]}
            disabled={isExist || isLoading}
            onPress={() => handleCreate(item.code)}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image style={styles.flagIcon} source={item.flag} />
              <Text
                style={{ fontSize: 16, color: isStatus ? 'gray' : 'black' }}
              >
                {item.code}
              </Text>
            </View>
            {isStatus ? (
              <Text style={{ color: 'green' }}>Active</Text>
            ) : (
              <Text style={{ color: 'red' }}>InActive</Text>
            )}
            {isExist ? (
              isApproved ? (
                <Text style={{ color: 'green' }}>Approved</Text>
              ) : (
                <Text style={{ color: 'red' }}>Pending</Text>
              )
            ) : (
              <Text style={{ color: 'gray' }}>Not requested</Text>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default ActivateCurrency;
const styles = StyleSheet.create({
  flagIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  Card: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    width: '90%',
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
});
