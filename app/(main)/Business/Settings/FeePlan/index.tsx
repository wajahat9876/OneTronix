/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
import { useBusinessDetails } from '@/store/selectors/business/business';
import { BusinessFeePlanImages } from '@src/components/commons/business/signup/account_types/images';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useCapitalizeFirstWord from '@src/hooks/useCapitalizeFirst';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { accountTypeExpandedStyle } from '@src/styles/Signup';
import { vs } from '@utils/design/design';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { ScrollView } from 'react-native-gesture-handler';

const Fee_Plan = ({ goTo }: MultiStepFormProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const { capitalizeFirstWord } = useCapitalizeFirstWord();
  const { getCurrencySymbol } = useCurrencyFlag();
  const formatNestedObject = (obj: any, prefix = '') => {
    return Object.entries(obj)
      .filter(([key]) => key !== '_id') // it ensure not to map _id from data
      .flatMap(([key, value]): any => {
        if (typeof value === 'object' && value !== null) {
          return formatNestedObject(value, `${prefix}${key} - `);
        }
        return {
          label: `${prefix}${key.replace(/([A-Z])/g, ' $1').trim()}`,
          value: value ?? 'N/A',
        };
      });
  };

  const otherCurrencies =
    businessData?.accountsFee?.payments?.otherCurrencies || [];
  const [selectedCurrency, setSelectedCurrency] = useState(
    otherCurrencies.length > 0 ? otherCurrencies[0].currency : '',
  );

  const selectedCurrencyData =
    otherCurrencies.find(
      (currency: any) => currency.currency === selectedCurrency,
    ) || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { otherCurrencies: _, ...filteredPayments } =
    businessData?.accountsFee?.payments || {};

  const mappedSections = [
    {
      title: 'Account Fees',
      items: formatNestedObject(businessData?.accountsFee?.accountFee),
    },
    {
      title: 'Other Fees',
      items: formatNestedObject(businessData?.accountsFee?.otherFee),
    },
    {
      title: 'Corporate Accounts',
      items: formatNestedObject(businessData?.accountsFee?.corporateAccounts),
    },
  ];

  return (
    <ScreenAuth
      title="My Plan"
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
        goTo?.(0);
      }}
    >
      <ScrollView style={{ flex: 1, padding: vs(10) }}>
        <View style={globalStyle.authTopCurvedCard}>
          <View className="self-center">{BusinessFeePlanImages[0]}</View>
          <Text style={accountTypeExpandedStyle.heading}>
            {businessData?.accountsFee?.accountName}
          </Text>
          <FlatList
            className="mt-4"
            scrollEnabled
            contentContainerStyle={{ paddingTop: vs(24) }}
            data={mappedSections}
            renderItem={({ item }) => (
              <View className="mb-4">
                <Text className="text-lg font-bold mb-2">{item.title}</Text>
                {item.items.map((entry: any, idx: any) => {
                  const shouldHideSymbol =
                    entry.label === 'daily Transaction Volume' ||
                    entry.label === 'weekly Transaction Volume';
                  return (
                    <View
                      key={idx}
                      className="flex-row justify-between px-2 py-1  "
                    >
                      <Text className="text-base " style={{ fontSize: 9 }}>
                        {capitalizeFirstWord(entry.label)}
                      </Text>
                      <Text className="text-base " style={{ fontSize: 8 }}>
                        {shouldHideSymbol
                          ? Number(entry.value ?? 0).toFixed(2)
                          : `£${Number(entry.value ?? 0).toFixed(2)}`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
            // eslint-disable-next-line @typescript-eslint/no-shadow
            keyExtractor={(_, index) => index.toString()}
          />

          {/* Payments Section */}
          <View className="mt-4">
            <Text className="text-lg font-bold mb-2">Payments</Text>

            {Object.keys(filteredPayments).length > 0 &&
              formatNestedObject(filteredPayments).map(
                (entry: any, idx: any) => (
                  <View
                    key={idx}
                    className="flex-row justify-between px-2 py-1  "
                  >
                    <Text className="text-base" style={{ fontSize: 9 }}>
                      {capitalizeFirstWord(entry.label)}
                    </Text>
                    <Text className="text-base " style={{ fontSize: 8 }}>
                      {`£${Number(entry.value ?? 0).toFixed(2)}`}
                    </Text>
                  </View>
                ),
              )}

            {/* Other Currencies Dropdown */}
            {otherCurrencies.length > 0 && (
              <View className="mt-4">
                <Text className="text-lg font-bold mb-2">Select Currency</Text>
                <Dropdown
                  data={otherCurrencies.map((currency: any) => ({
                    label: currency.currency,
                    value: currency.currency,
                  }))}
                  labelField="label"
                  valueField="value"
                  value={selectedCurrency}
                  onChange={item => setSelectedCurrency(item.value)}
                  style={{
                    height: 50,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                  }}
                  placeholder="Select a currency"
                />

                {/* Show selected currency details */}
                {selectedCurrency && (
                  <View className="mt-2 mb-6">
                    {formatNestedObject(selectedCurrencyData).map(
                      (entry: any, idx: any) => {
                        const isPercentField =
                          entry.label ===
                            'fasterPaymentsInbound - percent Per Transcation' ||
                          entry.label ===
                            'fasterPaymentsOutbound - percent Per Transcation1';
                        const shouldHideSymbol =
                          entry.label === 'currency' || isPercentField;
                        const displayValue = `${entry.value}${
                          isPercentField ? '%' : ''
                        }`;

                        return (
                          <View
                            key={idx}
                            className="flex-row justify-between px-2 py-1"
                          >
                            <Text
                              className="text-base text-gray-700"
                              style={{ fontSize: 9 }}
                            >
                              {capitalizeFirstWord(entry.label)}
                            </Text>
                            <Text
                              className="text-base "
                              style={{ fontSize: 8 }}
                            >
                              {shouldHideSymbol
                                ? displayValue
                                : `${getCurrencySymbol(
                                    selectedCurrency,
                                  )}${Number(entry.value ?? 0).toFixed(2)} `}
                            </Text>
                          </View>
                        );
                      },
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenAuth>
  );
};

export default Fee_Plan;
